import Runnable from './contexts/runnable';
import Visitable from './contexts/visitable';

import Meter from '../common/meter';

import Visitor from './visitor';

export type RaceCallbackFunction = (this: Race, ctx: Race) => void;

type RaceContext = Visitable & Runnable;

export default class Race implements RaceContext {
	private readonly _meter: Meter = new Meter();

	constructor(
		private readonly _title: string,
		private readonly _callback: RaceCallbackFunction
	) {
		// Empty
	}

	public get title(): string {
		return this._title;
	}

	public get callback(): RaceCallbackFunction {
		return this._callback;
	}

	public get meter(): Meter {
		return this._meter;
	}

	public async run(): Promise<void> {
		await this._callback.call(this, this);
	}

	public accept(visitor: Visitor): void {
		visitor.visitRace(this);
	}
}
