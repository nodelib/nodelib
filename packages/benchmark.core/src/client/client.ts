import Group, { GroupChildren, GroupSettings } from './group';
import Hook, { HookCallbackFunction, HookType } from './hook';
import Race, { RaceCallbackFunction } from './race';

import GroupQueueConverter, { GroupQueue } from './converters/group-queue';

export default class Client {
	private readonly _groupQueueConverter: GroupQueueConverter = new GroupQueueConverter();

	/**
	 * Represents the root group, which includes all child nodes.
	 */
	public setup(title: string, children: GroupChildren, settings: GroupSettings): GroupQueue {
		this._validateSetupSettings(settings);

		const group = this.group(title, children, settings);

		return this._groupQueueConverter.convert(group);
	}

	/**
	 * Group, uniting hooks, race and other groups.
	 * Allows you to set the settings for the races.
	 */
	public group(title: string, children: GroupChildren, settings?: GroupSettings): Group {
		return new Group(title, children, settings);
	}

	/**
	 * Creates a race.
	 */
	public race(title: string, callback: RaceCallbackFunction): Race {
		return new Race(title, callback);
	}

	/**
	 * Creates a hook that will be launched before all the races in this group.
	 */
	public before(callback: HookCallbackFunction): Hook {
		return new Hook(HookType.Before, callback);
	}

	/**
	 * Creates a hook that will be launched before all the races in this group and nested groups.
	 */
	public beforeEach(callback: HookCallbackFunction): Hook {
		return new Hook(HookType.BeforeEach, callback);
	}

	/**
	 * Creates a hook that will be launched before each the race iteration in this group.
	 */
	public beforeIteration(callback: HookCallbackFunction): Hook {
		return new Hook(HookType.BeforeIteration, callback);
	}

	/**
	 * Creates a hook that will be launched before each the race iterations in this group and nested groups.
	 */
	public beforeEachIteration(callback: HookCallbackFunction): Hook {
		return new Hook(HookType.BeforeEachIteration, callback);
	}

	/**
	 * Creates a hook that will be launched after all the races in this group.
	 */
	public after(callback: HookCallbackFunction): Hook {
		return new Hook(HookType.After, callback);
	}

	/**
	 * Creates a hook that will be launched after all the races in this group and nested groups.
	 */
	public afterEach(callback: HookCallbackFunction): Hook {
		return new Hook(HookType.AfterEach, callback);
	}

	/**
	 * Creates a hook that will be launched after each the race iterations in this group.
	 */
	public afterIteration(callback: HookCallbackFunction): Hook {
		return new Hook(HookType.AfterIteration, callback);
	}

	/**
	 * Creates a hook that will be launched after each the race iterations in this group and nested groups.
	 */
	public afterEachIteration(callback: HookCallbackFunction): Hook {
		return new Hook(HookType.AfterEachIteration, callback);
	}

	private _validateSetupSettings(settings: GroupSettings): void | never {
		if (!this._isNumber(settings.warmupCount)) {
			throw new RangeError('The settings object is incomplete. The "warmupCount" property is required and must be a number.');
		}
		if (!this._isNumber(settings.launchCount)) {
			throw new RangeError('The settings object is incomplete. The "launchCount" property is required and must be a number.');
		}
		if (!this._isNumber(settings.iterationCount)) {
			throw new RangeError('The settings object is incomplete. The "iterationCount" property is required and must be a number.');
		}
	}

	private _isNumber(value?: Object): value is number {
		return typeof value === 'number';
	}
}
