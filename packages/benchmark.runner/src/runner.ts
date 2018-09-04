import * as events from 'events';
import * as path from 'path';

import execa = require('execa');
import pMap = require('p-map');

import { Race } from '@nodelib/benchmark.client';
import { NSQueue } from '@nodelib/benchmark.queue';
import { NSWorker, NSWorkerAnalyzer } from '@nodelib/benchmark.worker';

import ResultBox, { NSResultBox } from './result-box';
import * as utils from './utils/index';

/**
 * A path to the worker module inside this package.
 */
const WORKER_PATH = path.resolve(__dirname, './worker/index.js');

export namespace NSRunner {
	export enum MessageEvent {
		Name = 'progress'
	}

	export namespace Message {
		export interface Payload {
			type: Type;
			box: ResultBox;
		}

		export enum Type {
			Start = 'start',
			Launch = 'launch',
			Finish = 'finish'
		}
	}
}

export default class Runner extends events.EventEmitter {
	private _latestModulePath?: string;

	public start(modulePath: string, queue: NSQueue.Queue): Promise<ResultBox[]> {
		this._latestModulePath = modulePath;

		return pMap(queue, (race, index) => this._runRace(race, index), {
			concurrency: 1
		});
	}

	protected async _spawnWorker(raceIndex: number): Promise<NSWorkerAnalyzer.Result> {
		const args = [WORKER_PATH, this._latestModulePath as string, raceIndex].map((arg) => arg.toString());

		const stream = execa('node', args, {
			stdio: ['pipe', 'pipe', 'pipe', 'ipc']
		});

		return new Promise<NSWorkerAnalyzer.Result>((resolve, reject) => {
			stream.once('message', resolve);
			stream.once('exit', () => resolve([]));
			stream.once('error', reject);
		});
	}

	private async _runRace(race: Race, raceIndex: number): Promise<ResultBox> {
		const settings = utils.race.getSettings(race);

		const box = new ResultBox(race, settings);

		this._emit({ type: NSRunner.Message.Type.Start, box });

		const times = Array(settings.launchCount).fill(0);

		await pMap(times, () => this._makeAndAttachRaceLaunch(box, raceIndex), {
			concurrency: settings.parallel
		});

		this._emit({ type: NSRunner.Message.Type.Finish, box });

		return box;
	}

	private async _makeAndAttachRaceLaunch(box: ResultBox, raceIndex: number): Promise<void> {
		const result = await this._spawnWorker(raceIndex);

		const launch = this._makeResultLaunch(result);

		box.addLaunch(launch);

		this._emit({ type: NSRunner.Message.Type.Launch, box });
	}

	private _makeResultLaunch(result: NSWorkerAnalyzer.Result): NSResultBox.Launch {
		return result.map(this._convertMarkerToIteration, this);
	}

	private _convertMarkerToIteration(markers: NSWorkerAnalyzer.ResultItem): NSResultBox.Iteration {
		const totalTime = markers[NSWorker.Symbols.IterationTime];

		delete markers[NSWorker.Symbols.IterationTime];
		delete markers[NSWorker.Symbols.IterationEmptyMethodTime];

		return { totalTime, markers };
	}

	private _emit(payload: NSRunner.Message.Payload): void {
		this.emit(NSRunner.MessageEvent.Name, payload);
	}
}
