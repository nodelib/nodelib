import { Meter } from '@nodelib/benchmark.meter';

import Group from './group';

import Groupable from './contexts/groupable';
import Runnable from './contexts/runnable';
import Visitable, { Visitor } from './contexts/visitable';

export namespace NSRace {
	export type Context = Visitable & Runnable & Groupable;

	export type Callback = (this: Race, ctx: CallbackContext) => void;
	export interface CallbackContext {
		meter: Meter;
	}
}

export default class Race implements NSRace.Context {
	private readonly _meter: Meter = new Meter();

	private _group?: Group;

	constructor(
		private readonly _title: string,
		private readonly _callback: NSRace.Callback
	) { }

	/**
	 * Title of race.
	 */
	public get title(): string {
		return this._title;
	}

	/**
	 * The callback function for the race.
	 */
	public get callback(): NSRace.Callback {
		return this._callback;
	}

	/**
	 * Parent group for the race.
	 */
	public get group(): Group | undefined {
		return this._group;
	}

	public set group(group: Group | undefined) {
		this._group = group;
	}

	/**
	 * Instance of the Meter.
	 */
	public get meter(): Meter {
		return this._meter;
	}

	/**
	 * Call the callback function.
	 */
	// tslint:disable-next-line no-any
	public async run(): Promise<any> {
		return this._callback.call(this, { meter: this._meter });
	}

	/**
	 * Accept visitor.
	 */
	public accept(visitor: Visitor): void {
		visitor.visitRace(this);
	}
}
