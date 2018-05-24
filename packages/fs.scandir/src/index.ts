import * as fs from 'fs';

import * as optionsManager from './managers/options';

import * as scandirProvider from './providers/scandir';

import { FilterFunction, Options, PreFilterFunction, SortFunction } from './managers/options';
import { DirEntry } from './types/entry';

/**
 * Asynchronous API.
 */
export function scandir(path: fs.PathLike, opts?: Options): Promise<DirEntry[]> {
	return new Promise((resolve, reject) => {
		return scandirProvider.async(path, optionsManager.prepare(opts), (err, stats) => err ? reject(err) : resolve(stats));
	});
}

/**
 * Synchronous API.
 */
export function scandirSync(path: fs.PathLike, opts?: Options): DirEntry[] {
	return scandirProvider.sync(path, optionsManager.prepare(opts));
}

export type DirEntry = DirEntry;
export type Options = Options;
export type PreFilterFunction = PreFilterFunction;
export type FilterFunction = FilterFunction;
export type SortFunction = SortFunction;
