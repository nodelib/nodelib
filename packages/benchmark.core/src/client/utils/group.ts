import Group from '../group';

/**
 * Returns true if something is a group.
 */
export function isGroup(something: Object): something is Group {
	return something instanceof Group;
}
