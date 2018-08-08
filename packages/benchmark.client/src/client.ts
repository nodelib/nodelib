import Group, { NSGroup } from './group';
import Hook, { NSHook } from './hook';
import Race, { NSRace } from './race';

export default class Client {
	/**
	 * Represents the root group, which includes all children nodes.
	 */
	public suite(title: string, children: NSGroup.Children, settings: NSGroup.Settings): Group {
		this._validateSetupSettings(settings);

		return this.group(title, children, settings);
	}

	/**
	 * A group that can include hooks, race and other groups.
	 * Allows you to set the settings for the races.
	 */
	public group(title: string, children: NSGroup.Children, settings?: NSGroup.Settings): Group {
		return new Group(title, children, settings);
	}

	/**
	 * Creates a race.
	 */
	public race(title: string, callback: NSRace.Callback): Race {
		return new Race(title, callback);
	}

	/**
	 * Creates a hook that will be launched before all the races in this group.
	 */
	public before(callback: NSHook.Callback): Hook {
		return new Hook(NSHook.Type.Before, callback);
	}

	/**
	 * Creates a hook that will be launched before all the races in this group and children groups.
	 */
	public beforeEach(callback: NSHook.Callback): Hook {
		return new Hook(NSHook.Type.BeforeEach, callback);
	}

	/**
	 * Creates a hook that will be launched before each the race iteration in this group.
	 */
	public beforeIteration(callback: NSHook.Callback): Hook {
		return new Hook(NSHook.Type.BeforeIteration, callback);
	}

	/**
	 * Creates a hook that will be launched before each the race iterations in this group and children groups.
	 */
	public beforeEachIteration(callback: NSHook.Callback): Hook {
		return new Hook(NSHook.Type.BeforeEachIteration, callback);
	}

	/**
	 * Creates a hook that will be launched after all the races in this group.
	 */
	public after(callback: NSHook.Callback): Hook {
		return new Hook(NSHook.Type.After, callback);
	}

	/**
	 * Creates a hook that will be launched after all the races in this group and children groups.
	 */
	public afterEach(callback: NSHook.Callback): Hook {
		return new Hook(NSHook.Type.AfterEach, callback);
	}

	/**
	 * Creates a hook that will be launched after each the race iterations in this group.
	 */
	public afterIteration(callback: NSHook.Callback): Hook {
		return new Hook(NSHook.Type.AfterIteration, callback);
	}

	/**
	 * Creates a hook that will be launched after each the race iterations in this group and children groups.
	 */
	public afterEachIteration(callback: NSHook.Callback): Hook {
		return new Hook(NSHook.Type.AfterEachIteration, callback);
	}

	private _validateSetupSettings(settings: NSGroup.Settings): void | never {
		if (!this._isNumber(settings.warmupCount)) {
			this._throwMissingPropertyError('warmupCount', 'number');
		}
		if (!this._isNumber(settings.launchCount)) {
			this._throwMissingPropertyError('launchCount', 'number');
		}
		if (!this._isNumber(settings.iterationCount)) {
			this._throwMissingPropertyError('iterationCount', 'number');
		}
		if (!this._isNumber(settings.parallel)) {
			this._throwMissingPropertyError('parallel', 'number');
		}
	}

	/* tslint:disable-next-line no-any */
	private _isNumber(value?: any): value is number {
		return typeof value === 'number';
	}

	private _throwMissingPropertyError(prop: string, type: string): never {
		throw new RangeError(`The settings object is incomplete. The "${prop}" property is required and must be a ${type}.`);
	}
}
