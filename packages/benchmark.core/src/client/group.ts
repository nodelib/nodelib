import Hook from './hook';
import Race from './race';

import Visitable from './contexts/visitable';

import Visitor from './visitor';

import * as utils from '../common/utils';

export type GroupChildrenItem = Group | Hook | Race;
export type GroupChildren = GroupChildrenItem[];

export interface GroupSettings {
	warmupCount?: number;
	launchCount?: number;
	iterationCount?: number;
}

export type StrictGroupSettings = Required<GroupSettings>;

type GroupContext = Visitable;

export default class Group implements GroupContext {
	private readonly _hooks: Hook[] = [];
	private readonly _races: Race[] = [];

	private _parent?: Group = undefined;

	constructor(
		private readonly _title: string,
		private readonly _children: GroupChildren,
		private readonly _settings?: GroupSettings
	) {
		this._setParentGroupToChildrenGroups();

		this._applyChildrenHooksToGroup();
		this._applyChildrenRacesToGroup();
	}

	public get title(): string {
		return this._title;
	}

	public get children(): GroupChildren {
		return this._children;
	}

	public get settings(): GroupSettings | undefined {
		return this._settings;
	}

	public get parent(): Group | undefined {
		return this._parent;
	}

	public set parent(value: Group | undefined) {
		this._parent = value;
	}

	public get hooks(): Hook[] {
		return this._hooks;
	}

	public get races(): Race[] {
		return this._races;
	}

	public accept(visitor: Visitor): void {
		visitor.visitGroup(this);
	}

	/**
	 * Sets the current group as the parent of all children groups.
	 */
	private _setParentGroupToChildrenGroups(): void {
		this._getChildrenGroups().forEach((group) => group.parent = this);
	}

	/**
	 * Returns all children groups for the current group.
	 */
	private _getChildrenGroups(): Group[] {
		return this.children.filter(utils.group.isGroup);
	}

	/**
	 * Applies all children hooks to the current group.
	 */
	private _applyChildrenHooksToGroup(): void {
		this._getChildrenHooks().forEach((hook) => this._hooks.push(hook));
	}

	/**
	 * Returns all children hooks for the current group.
	 */
	private _getChildrenHooks(): Hook[] {
		return this.children.filter(utils.hook.isHook);
	}

	/**
	 * Applies all children races to the current group.
	 */
	private _applyChildrenRacesToGroup(): void {
		this._getChildrenRaces().forEach((race) => this._races.push(race));
	}

	/**
	 * Returns all children races for the current group.
	 */
	private _getChildrenRaces(): Race[] {
		return this.children.filter(utils.race.isRace);
	}
}
