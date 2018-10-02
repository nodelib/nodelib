import { Hook, NSGroup, NSHook, Race } from '@nodelib/benchmark.client';
import { Meter } from '@nodelib/benchmark.meter';
import { NSQueue } from '@nodelib/benchmark.queue';

import WorkerAnalyzer from './analyzer';
import * as utils from './utils/index';

export namespace NSWorker {
	export enum Symbols {
		IterationStart = 'IterationStart',
		IterationEnd = 'IterationEnd',

		IterationTime = 'IterationTime',
		IterationEmptyMethodTime = 'IterationEmptyMethodTime'
	}
}

export default class Worker {
	protected readonly _analyzer: WorkerAnalyzer = new WorkerAnalyzer();
	protected readonly _meter: Meter = new Meter();

	constructor(protected readonly _queue: NSQueue.Queue) { }

	/**
	 * Starts work on the specified race.
	 */
	public start(raceIndex: number): Promise<void> {
		const race = utils.queue.getRaceByIndex(this._queue, raceIndex);

		return this._runRace(race);
	}

	protected _report(obj: Object): void {
		if (process.send === undefined) {
			throw new Error('You cannot use worker as a master process.');
		}

		process.send(obj);
	}

	/**
	 * Prepares the data to run the race iteration and run them then.
	 */
	private async _runRace(race: Race): Promise<void> {
		const hooks = utils.race.getHooks(race);
		const settings = utils.race.getSettings(race);

		await this._runHooksWithType(hooks, [NSHook.Type.Before, NSHook.Type.BeforeEach]);
		await this._runRaceInMode(race, hooks, settings);
		await this._runHooksWithType(hooks, [NSHook.Type.After, NSHook.Type.AfterEach]);
	}

	/**
	 * Runs race in the warmup and work mode.
	 */
	private async _runRaceInMode(race: Race, hooks: Hook[], settings: NSGroup.StrictSettings): Promise<void> {
		let debugLines: string[] = [];

		console.debug = (message: string) => debugLines.push(message);

		await this._runRaceIterations(race, hooks, settings.warmupCount);
		debugLines = [];
		await this._runRaceIterations(race, hooks, settings.iterationCount);

		const metrics = this._analyzer.analyze(debugLines.join('\n'));

		this._report(metrics);
	}

	/**
	 * Starts iterations of the specified race.
	 */
	private async _runRaceIterations(race: Race, hooks: Hook[], iterationCount: number): Promise<void> {
		if (iterationCount === 0) {
			return;
		}

		for (let index = 0; index < iterationCount; index++) {
			this._meter.common(NSWorker.Symbols.IterationStart, index);

			await this._runHooksWithType(hooks, [NSHook.Type.BeforeIteration, NSHook.Type.BeforeEachIteration]);
			await this._runRaceOnce(race);
			await this._runHooksWithType(hooks, [NSHook.Type.AfterIteration, NSHook.Type.AfterEachIteration]);

			this._meter.common(NSWorker.Symbols.IterationEnd, index);
		}
	}

	/**
	 * Runs hooks with the specified types.
	 */
	private async _runHooksWithType(hooks: Hook[], types: NSHook.Type[]): Promise<void> {
		const selectedHooks = utils.hook.getHooksWithTypes(hooks, types);

		for (const hook of selectedHooks) {
			await hook.run();
		}
	}

	/**
	 * Runs the race.
	 */
	private async _runRaceOnce(race: Race): Promise<void> {
		this._meter.time(NSWorker.Symbols.IterationEmptyMethodTime);
		await this._emptyMethod();
		this._meter.time(NSWorker.Symbols.IterationEmptyMethodTime);

		this._meter.time(NSWorker.Symbols.IterationTime);
		await race.run();
		this._meter.time(NSWorker.Symbols.IterationTime);
	}

	/**
	 * An empty method required to evaluate the noise of an asynchronous wrapper.
	 */
	private async _emptyMethod(): Promise<void> {
		return undefined;
	}
}
