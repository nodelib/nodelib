import { Group, NSGroup, Race } from '@nodelib/benchmark.client';

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
