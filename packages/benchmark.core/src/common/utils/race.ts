import Race from '../../client/race';

/**
 * Returns true if something is a race.
 */
export function isRace(something: Object): something is Race {
	return something instanceof Race;
}
