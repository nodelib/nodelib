import Group from '../group';

/**
 * Returns true if something is a group.
 */
/* tslint:disable-next-line no-any */
export function is(something: any): something is Group {
	return something instanceof Group;
}
