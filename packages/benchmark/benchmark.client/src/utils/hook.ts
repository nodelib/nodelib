import Hook from '../hook';

/**
 * Returns true if something is a hook.
 */
/* tslint:disable-next-line no-any */
export function is(something: any): something is Hook {
	return something instanceof Hook;
}
