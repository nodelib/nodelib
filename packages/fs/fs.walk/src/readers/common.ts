import type { FilterFunction, Settings } from '../settings';
import type { ErrnoException } from '../types';

export function isFatalError(settings: Settings, error: ErrnoException): boolean {
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

export function getPathPrefix(filepath: string, separator: string): string {
	/**
	 * Correctly handles an empty base path, roots (`/`, `C:/`) and UNC paths (`//?/C:/`).
	 */
	if (filepath === '' || filepath.endsWith(separator)) {
		return filepath;
	}

	return filepath + separator;
}
