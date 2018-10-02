import Hook from './hook';
import Race from './race';

import * as utils from './utils';

import Groupable from './contexts/groupable';
import Visitable, { Visitor } from './contexts/visitable';

export namespace NSGroup {
	export type Context = Visitable & Groupable;

	export type ChildrenItem = Group | Hook | Race;
	export type Children = ChildrenItem[];

	export interface Settings {
		warmupCount?: number;
		launchCount?: number;
		iterationCount?: number;
		parallel?: number;
	}

	export type StrictSettings = Required<Settings>;
}

export default class Group implements NSGroup.Context {
	private _group?: Group;

	constructor(
		private readonly _title: string,
		readonly _children: NSGroup.Children,
		private readonly _settings?: NSGroup.Settings
	) {
		this._validateVarietyOfChildItems();
		this._setParentGroupToChildrenItems();
	}

	/**
	 * Title of group.
	 */
	public get title(): string {
		return this._title;
	}

	/**
	 * Children of group.
	 */
	public get children(): NSGroup.Children {
		return this._children;
	}

	/**
	 * Settings of group.
	 */
	public get settings(): NSGroup.Settings | undefined {
		return this._settings;
	}

	/**
	 * Parent group of group.
	 */
	public get group(): Group | undefined {
		return this._group;
	}

	public set group(group: Group | undefined) {
		this._group = group;
	}

	/**
	 * All children groups for the current group.
	 */
	public get groups(): Group[] {
		return this._children.filter(utils.group.is);
	}

	/**
	 * All children hooks for the current group.
	 */
	public get hooks(): Hook[] {
		return this._children.filter(utils.hook.is);
	}

	/**
	 * All children races for the current group.
	 */
	public get races(): Race[] {
		return this._children.filter(utils.race.is);
	}

	/**
	 * Accept visitor.
	 */
	public accept(visitor: Visitor): void {
		visitor.visitGroup(this);
	}

	/**
	 * Check for a valid type intersection.
	 */
	private _validateVarietyOfChildItems(): void {
		if (this.groups.length !== 0 && this.races.length !== 0) {
			throw new TypeError('A group cannot contain groups and races at the same time.');
		}
	}

	/**
	 * Sets the current group as the tparent of all children items.
	 */
	private _setParentGroupToChildrenItems(): void {
		this._children.forEach((item) => item.group = this);
	}
}
