import * as fs from 'fs';

import * as fsAdapter from './adapters/fs';
import * as optionsManager from './managers/options';
import * as statProvider from './providers/stat';

import { Options } from './managers/options';

const fsAdapterAsync = new fsAdapter.FileSystemAsync();
const fsAdapterSync = new fsAdapter.FileSystemSync();

/**
 * Asynchronous API.
 */
export function stat(path: fs.PathLike, opts?: Options): Promise<fs.Stats> {
	return new Promise((resolve, reject) => {
		statProvider.async(fsAdapterAsync, path, optionsManager.prepare(opts), (err, stats) => err ? reject(err) : resolve(stats));
	});
}

/**
 * Synchronous API.
 */
export function statSync(path: fs.PathLike, opts?: Options): fs.Stats {
	return statProvider.sync(fsAdapterSync, path, optionsManager.prepare(opts));
}

export type Options = Options;
