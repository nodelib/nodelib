import Settings, { FilterFunction } from '../settings';
import { Errno } from '../types/index';

export function isFatalError(settings: Settings, error: Errno): boolean {
	if (settings.errorFilter === null) {
		return true;
	}

	return !settings.errorFilter(error);
}

export function isAppliedFilter<T>(filter: FilterFunction<T> | null, value: T): boolean {
	return filter === null || filter(value);
}
