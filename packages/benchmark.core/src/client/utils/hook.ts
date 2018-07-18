import Hook from '../hook';

/**
 * Returns true if something is a hook.
 */
export function isHook(something: Object): something is Hook {
	return something instanceof Hook;
}
