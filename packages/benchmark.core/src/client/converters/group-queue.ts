import Group from '../group';
import Visitor from '../visitor';

import * as utils from '../utils';

export type GroupQueueItem = Group;
export type GroupQueue = GroupQueueItem[];

export default class GroupQueueConverter implements Visitor {
	private readonly _queue: GroupQueue = [];

	/**
	 * Unfold nested groups to the group queue.
	 */
	public convert(group: Group): GroupQueue {
		group.accept(this);

		return this._queue;
	}

	public visitGroup(group: Group): void {
		this._queue.push(group);

		this._getChildrenGroups(group).forEach((item) => item.accept(this));
	}

	public visitHook(): void {
		// Empty
	}

	public visitRace(): void {
		// Empty
	}

	/**
	 * Returns all children groups for the current group.
	 */
	private _getChildrenGroups(group: Group): Group[] {
		return group.children.filter(utils.group.isGroup);
	}
}
