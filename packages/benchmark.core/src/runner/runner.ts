import * as path from 'path';

import execa = require('execa');

import * as utils from '../common/utils';
import Analyzer from './analyzer';
import Reporter from './reporter';

import { GroupQueue } from '../client/converters/group-queue';

const WORKER_PATH = path.resolve(__dirname, '../worker/index.js');

export namespace RunnerResult {
	export interface Group {
		title: string;
		races: Race[];
	}

	export interface Race {
		title: string;
		iterations: RaceIteration[];
	}

	export type RaceIteration = Statistic[];

	export interface Statistic {
		totalTime: number;
		totalMemory: number;
		markers: Record<string, number>;
	}
}

export default class Runner {
	private _queue: GroupQueue = [];

	private readonly _analyzer: Analyzer = new Analyzer();

	constructor(private readonly _modulePath: string, private readonly _reporter: Reporter) { }

	public async start(): Promise<RunnerResult.Group[]> {
		this._reporter.onStart();

		this._queue = await this._getQueue();

		const result = await this._run();

		this._reporter.onEnd();

		return result;
	}

	/**
	 * Returns the queue for the specified module.
	 */
	protected _getQueue(): Promise<GroupQueue> {
		return import(this._modulePath);
	}

	protected _getRaceIterationResult(groupIndex: number, raceIndex: number): Promise<string> {
		const args = ['--expose-gc', WORKER_PATH, this._modulePath, groupIndex, raceIndex];

		return execa('node', args.map((a) => a.toString())).then(({ stdout }) => stdout);
	}

	private async _run(): Promise<RunnerResult.Group[]> {
		const groups: RunnerResult.Group[] = [];

		for (let index = 0; index < this._queue.length; index++) {
			const title = this._queue[index].title;

			this._reporter.onGroupStart(title);
			const group = await this._runGroup(index);
			this._reporter.onGroupEnd(title, group);

			groups.push(group);
		}

		return groups;
	}

	private async _runGroup(groupIndex: number): Promise<RunnerResult.Group> {
		const races: RunnerResult.Race[] = [];

		const group = this._queue[groupIndex];

		for (let index = 0; index < group.races.length; index++) {
			const title = utils.group.getRaceByIndex(group, index).title;

			this._reporter.onRaceStart(title);
			const race = await this._runRace(groupIndex, index);
			this._reporter.onRaceEnd(title, race);

			races.push(race);
		}

		return {
			title: group.title,
			races
		};
	}

	private async _runRace(groupIndex: number, raceIndex: number): Promise<RunnerResult.Race> {
		const iterations: RunnerResult.RaceIteration[] = [];

		const group = this._queue[groupIndex];
		const race = utils.group.getRaceByIndex(group, raceIndex);
		const settings = utils.group.getCombinedSettings(group);

		for (let index = 0; index < settings.launchCount; index++) {
			this._reporter.onRaceIterationStart(index);
			const iteration = await this._runRaceIteration(groupIndex, raceIndex);
			const iterationWithoutWarmup = iteration.slice(settings.warmupCount);
			this._reporter.onRaceIterationEnd(index, iterationWithoutWarmup);

			iterations.push(iterationWithoutWarmup);
		}

		return {
			title: race.title,
			iterations
		};
	}

	private _runRaceIteration(groupIndex: number, raceIndex: number): Promise<RunnerResult.Statistic[]> {
		return this._getRaceIterationResult(groupIndex, raceIndex)
			.then((stdout) => this._analyzer.analyze(stdout));
	}
}
