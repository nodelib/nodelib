import Settings, { FilterFunction } from '../settings';
import { Errno } from '../types';

export function isFatalError(settings: Settings, error: Errno): boolean {
	if (settings.errorFilter === null) {
		return true;
	}

	return !settings.errorFilter(error);
}

export function isAppliedFilter<T>(filter: FilterFunction<T> | null, value: T): boolean {
	return filter === null || filter(value);
}

export function replacePathSegmentSeparator(filepath: string, separator: string): string {
	return filepath.split(/[/\\]/).join(separator);
}

export function joinPathSegments(a: string, b: string, separator: string): string {
	if (a === '') {
		return b;
	}

	return a + separator + b;
}
