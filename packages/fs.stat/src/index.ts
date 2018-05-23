import * as fs from 'fs';

import * as optionsManager from './managers/options';
import * as statProvider from './providers/stat';

import { FileSystemAdapter } from './adapters/fs';
import { Options } from './managers/options';
import { AsyncCallback } from './providers/stat';

/**
 * Asynchronous API.
 */
export function stat(path: fs.PathLike, opts?: Options): Promise<fs.Stats> {
	return new Promise((resolve, reject) => {
		statProvider.async(path, optionsManager.prepare(opts), (err, stats) => err ? reject(err) : resolve(stats));
	});
}

/**
 * Callback API.
 */
export function statCallback(path: fs.PathLike, callback: AsyncCallback): void;
export function statCallback(path: fs.PathLike, opts: Options, callback: AsyncCallback): void;
export function statCallback(path: fs.PathLike, optsOrCallback?: Options | AsyncCallback, callback?: AsyncCallback): void {
	if (typeof optsOrCallback === 'function') {
		callback = optsOrCallback; /* tslint:disable-line: no-parameter-reassignment */
		optsOrCallback = undefined; /* tslint:disable-line: no-parameter-reassignment */
	}
	if (typeof callback === 'undefined') {
		throw new TypeError('The "callback" argument must be of type Function.');
	}

	statProvider.async(path, optionsManager.prepare(optsOrCallback), callback);
}

/**
 * Synchronous API.
 */
export function statSync(path: fs.PathLike, opts?: Options): fs.Stats {
	return statProvider.sync(path, optionsManager.prepare(opts));
}

export type Options = Options;
export type StatAsyncCallback = AsyncCallback;
export type FileSystemAdapter = FileSystemAdapter;
