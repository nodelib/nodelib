import * as fs from 'fs';

import { FileSystemAsync, FileSystemSync, AsyncCallback } from '../adapters/fs';

import { StrictOptions } from '../managers/options';

export function sync(fsAdapter: FileSystemSync, path: fs.PathLike, options: StrictOptions): fs.Stats {
	const lstat = fsAdapter.lstat(path);

	if (!isFollowedSymlink(lstat, options)) {
		return lstat;
	}

	try {
		const stat = fsAdapter.stat(path);

		stat.isSymbolicLink = () => true;

		return stat;
	} catch (err) {
		if (!options.throwErrorOnBrokenSymlinks) {
			return lstat;
		}

		throw err;
	}
}

export function async(fsAdapter: FileSystemAsync, path: fs.PathLike, options: StrictOptions, callback: AsyncCallback): void {
	fsAdapter.lstat(path, (err0, lstat) => {
		if (err0) {
			return callback(err0);
		}

		if (!isFollowedSymlink(lstat as fs.Stats, options)) {
			return callback(null, lstat);
		}

		fsAdapter.stat(path, (err1, stat) => {
			if (err1) {
				return options.throwErrorOnBrokenSymlinks ? callback(err1) : callback(null, lstat);
			}

			(stat as fs.Stats).isSymbolicLink = () => true;

			callback(null, stat);
		});
	});
}

/**
 * Returns `true` for followed symlink.
 */
export function isFollowedSymlink(stat: fs.Stats, options: StrictOptions): boolean {
	return stat.isSymbolicLink() && options.followSymlinks;
}
