import Group, { StrictGroupSettings } from '../../client/group';
import Hook from '../../client/hook';
import Race from '../../client/race';

import * as commonUtils from '.';

import * as hookUtils from './hook';

/**
 * Returns true if something is a group.
 */
export function isGroup(something: Object): something is Group {
	return something instanceof Group;
}

/**
 * Returns all hooks that related to the specified group.
 */
export function getRelatedHooks(group: Group): Hook[] {
	let hooks: Hook[] = group.hooks;

	const parents = commonUtils.group.getParents(group, /* includeTopGroup */ false).reverse();

	for (const parent of parents) {
		const nestedHooks = parent.hooks.filter(hookUtils.isNestedHook);

		hooks = hooks.concat(nestedHooks);
	}

	return hooks;
}

/**
 * Returns race by index or throw an error.
 */
export function getRaceByIndex(group: Group, index: number): Race | never {
	const length = group.races.length;
	if (index >= length) {
		throw new RangeError(`Race with index (${index}) does not exist. The current group has only ${length} races.`);
	}

	return group.races[index];
}

/**
 * Returns settings for the specified group.
 */
export function getCombinedSettings(group: Group): StrictGroupSettings {
	const groups = getParents(group);

	return groups.reduce((settings, _group) => {
		return Object.assign(settings, _group.settings);
	}, {} as StrictGroupSettings);
}

/**
 * Returns the chain of parent groups for the specified group.
 */
export function getParents(group: Group, includeTopGroup: boolean = true): Group[] {
	const groups: Group[] = includeTopGroup ? [group] : [];

	let current: Group | undefined = group.parent;

	while (current !== undefined) {
		groups.push(current);

		current = current.parent;
	}

	return groups.reverse();
}
