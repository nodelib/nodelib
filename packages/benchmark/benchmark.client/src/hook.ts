import Group from './group';

import Groupable from './contexts/groupable';
import Runnable from './contexts/runnable';
import Visitable, { Visitor } from './contexts/visitable';

export namespace NSHook {
	export type Context = Runnable & Visitable & Groupable;

	export enum Type {
		Before,
		BeforeEach,
		BeforeIteration,
		BeforeEachIteration,
		After,
		AfterEach,
		AfterIteration,
		AfterEachIteration
	}

	export type Callback = (this: Hook) => void;
}

export default class Hook implements NSHook.Context {
	private _group?: Group;

	constructor(
		private readonly _type: NSHook.Type,
		private readonly _callback: NSHook.Callback
	) { }

	/**
	 * Type of hook.
	 */
	public get type(): NSHook.Type {
		return this._type;
	}

	/**
	 * The callback function for the hook.
	 */
	public get callback(): NSHook.Callback {
		return this._callback;
	}

	/**
	 * Parent group for the hook.
	 */
	public get group(): Group | undefined {
		return this._group;
	}

	public set group(group: Group | undefined) {
		this._group = group;
	}

	/**
	 * Call the callback function.
	 */
	// tslint:disable-next-line no-any
	public async run(): Promise<any> {
		return this._callback.call(this);
	}

	/**
	 * Accept visitor.
	 */
	public accept(visitor: Visitor): void {
		visitor.visitHook(this);
	}
}
