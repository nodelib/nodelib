import Runnable from './contexts/runnable';
import Visitable from './contexts/visitable';

import Visitor from './visitor';

export type HookCallbackFunction = (this: Hook) => void;

export enum HookType {
	Before,
	BeforeEach,
	BeforeIteration,
	BeforeEachIteration,
	After,
	AfterEach,
	AfterIteration,
	AfterEachIteration
}

type HookContext = Visitable & Runnable;

export default class Hook implements HookContext {
	constructor(
		private readonly _type: HookType,
		private readonly _callback: HookCallbackFunction
	) {
		// Empty
	}

	public get type(): HookType {
		return this._type;
	}

	public get callback(): HookCallbackFunction {
		return this._callback;
	}

	public async run(): Promise<void> {
		await this._callback.call(this);
	}

	public accept(visitor: Visitor): void {
		visitor.visitHook(this);
	}
}
