import Group from '../client/group';
import Hook, { HookType } from '../client/hook';
import Race from '../client/race';

import Meter from '../common/meter';

import * as utils from '../common/utils';

import { GroupQueue } from '../client/converters/group-queue';

export interface WorkerTask {
	modulePath: string;
	groupIndex: number;
	raceIndex: number;
}

export const RACE_ITERATION_SEPARATOR = 'RACE_ITERATION_SEPARATOR';
export const RACE_ITERATION_TIME = 'RACE_ITERATION_TIME';
export const RACE_ITERATION_MEMORY = 'RACE_ITERATION_MEMORY';
export const RACE_EMPTY_METHOD_TIME = 'RACE_EMPTY_METHOD_TIME';

export default class Worker {
	protected readonly _meter: Meter = new Meter();

	private _queue: GroupQueue = [];

	constructor(private readonly _task: WorkerTask) { }

	/**
	 * Starts work on the current task.
	 */
	public async start(): Promise<void> {
		this._queue = await this._getQueue();

		return this._run();
	}

	/**
	 * Returns the queue for the specified module.
	 */
	protected _getQueue(): Promise<GroupQueue> {
		return import(this._task.modulePath);
	}

	/**
	 * Prepares the data to run the race iteration.
	 */
	private async _run(): Promise<void> {
		const group = this._getSelectedGroup();

		const hooks = utils.group.getRelatedHooks(group);
		const race = utils.group.getRaceByIndex(group, this._task.raceIndex);
		const settings = utils.group.getCombinedSettings(group);

		await this._runRaceIteration(race, hooks, settings.warmupCount + settings.iterationCount);
	}

	/**
	 * Returns selected group for the current task.
	 */
	private _getSelectedGroup(): Group {
		return this._queue[this._task.groupIndex];
	}

	/**
	 * Starts the race iteration.
	 */
	private async _runRaceIteration(race: Race, hooks: Hook[], iterationCount: number): Promise<void> {
		if (iterationCount === 0) {
			return;
		}

		await this._runHooksWithType(hooks, [HookType.Before, HookType.BeforeEach]);

		for (let index = 0; index < iterationCount; index++) {
			await this._runHooksWithType(hooks, [HookType.BeforeIteration, HookType.BeforeEachIteration]);
			await this._runRaceOnce(race);
			await this._runHooksWithType(hooks, [HookType.AfterIteration, HookType.AfterEachIteration]);

			this._meter.common(RACE_ITERATION_SEPARATOR, 0);
		}

		await this._runHooksWithType(hooks, [HookType.After, HookType.AfterEach]);
	}

	/**
	 * Runs hooks with the specified types.
	 */
	private async _runHooksWithType(hooks: Hook[], types: HookType[]): Promise<void> {
		const selectedHooks = utils.hook.getHooksWithTypes(hooks, types);

		for (const hook of selectedHooks) {
			await hook.run();
		}
	}

	/**
	 * Runs the race.
	 */
	private async _runRaceOnce(race: Race): Promise<void> {
		this._meter.time(RACE_EMPTY_METHOD_TIME);
		await this._emptyMethod();
		this._meter.time(RACE_EMPTY_METHOD_TIME);

		this._meter.time(RACE_ITERATION_TIME);
		await race.run();
		this._meter.memory(RACE_ITERATION_MEMORY);
		this._meter.time(RACE_ITERATION_TIME);
	}

	/**
	 * An empty method required to evaluate the noise of an asynchronous wrapper.
	 */
	private async _emptyMethod(): Promise<void> {
		return undefined;
	}
}
