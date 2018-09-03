import { Group, Hook, NSGroup, Race } from '@nodelib/benchmark.client';

import * as utils from './index';

/**
 * Returns the chain of parent groups for the specified group.
 */
export function getGroups(race: Race): Group[] {
	if (race.group === undefined) {
		return [];
	}

	const groups: Group[] = [];

	let current: Group | undefined = race.group;

	while (current !== undefined) {
		groups.push(current);

		current = current.group;
	}

	return groups.reverse();
}

/**
 * Returns combined settings related to the specified race.
 */
export function getSettings(race: Race): NSGroup.StrictSettings {
	const groups = getGroups(race);
	const settings = groups.map((group) => group.settings);

	return Object.assign({}, ...settings);
}

/**
 * Returns hooks related to the specified race.
 */
export function getHooks(race: Race): Hook[] {
	const groups = getGroups(race);

	return groups.reduce((collection, group, index) => {
		if (index === groups.length - 1) {
			return collection.concat(group.hooks);
		}

		const nestedHooks = group.hooks.filter(utils.hook.isNestedHook);

		return collection.concat(nestedHooks);
	}, [] as Hook[]);
}
