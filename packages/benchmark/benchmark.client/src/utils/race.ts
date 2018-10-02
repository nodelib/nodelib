import Race from '../race';

/**
 * Returns true if something is a race.
 */
/* tslint:disable-next-line no-any */
export function is(something: any): something is Race {
	return something instanceof Race;
}
