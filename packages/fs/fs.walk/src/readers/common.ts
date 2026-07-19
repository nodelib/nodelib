import type { FilterFunction, Settings } from '../settings.js';
import type { ErrnoException } from '../types/index.js';

export function isFatalError(settings: Settings, error: ErrnoException): boolean {
	if (settings.errorFilter === null) {
		return true;
	}

	return !settings.errorFilter(error);
}

// Filters default to null when they are not configured.
// eslint-disable-next-line @typescript-eslint/no-restricted-types
export function isAppliedFilter<T>(filter: FilterFunction<T> | null, value: T): boolean {
	return filter === null || filter(value);
}

export function replacePathSegmentSeparator(filepath: string, separator: string): string {
	return filepath.split(/[/\\]/).join(separator);
}

export function getPathPrefix(filepath: string, separator: string): string {
	/**
	 * Correctly handles an empty base path, roots (`/`, `C:/`) and UNC paths (`//?/C:/`).
	 */
	if (filepath === '' || filepath.endsWith(separator)) {
		return filepath;
	}

	return filepath + separator;
}
