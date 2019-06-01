import * as path from 'path';

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

export function setBasePathForEntryPath(fullpath: string, root: string, base: string): string {
	let relative: string;

	if (fullpath.startsWith(root)) {
		relative = fullpath.replace(root, '').replace(/^[\\\/]/, '');
	} else {
		relative = path.relative(root, fullpath);
	}

	if (base === '') {
		return relative;
	}

	return `${base}${path.sep}${relative}`;
}
