import * as fs from 'fs';

import * as optionsManager from './managers/options';

import * as scandirProvider from './providers/scandir';

import { FileSystemAdapter } from './adapters/fs';
import { FilterFunction, Options, PreFilterFunction, SortFunction } from './managers/options';
import { AsyncCallback } from './providers/scandir';
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
 * Callback API.
 */
export function scandirCallback(path: fs.PathLike, callback: AsyncCallback): void;
export function scandirCallback(path: fs.PathLike, opts: Options, callback: AsyncCallback): void;
export function scandirCallback(path: fs.PathLike, optsOrCallback?: Options | AsyncCallback, callback?: AsyncCallback): void {
	if (typeof optsOrCallback === 'function') {
		callback = optsOrCallback; /* tslint:disable-line: no-parameter-reassignment */
		optsOrCallback = undefined; /* tslint:disable-line: no-parameter-reassignment */
	}
	if (callback === undefined) {
		throw new TypeError('The "callback" argument must be of type Function.');
	}

	scandirProvider.async(path, optionsManager.prepare(optsOrCallback), callback);
}

/**
 * Synchronous API.
 */
export function scandirSync(path: fs.PathLike, opts?: Options): DirEntry[] {
	return scandirProvider.sync(path, optionsManager.prepare(opts));
}

export type DirEntry = DirEntry;
export type Options = Options;
export type ScandirAsyncCallback = AsyncCallback;
export type FileSystemAdapter = FileSystemAdapter;
export type PreFilterFunction = PreFilterFunction;
export type FilterFunction = FilterFunction;
export type SortFunction = SortFunction;
