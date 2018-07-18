import Race from '../race';

/**
 * Returns true if something is a race.
 */
export function isRace(something: Object): something is Race {
	return something instanceof Race;
}
