import * as fs from 'fs';

import FileSystem from '../adapters/fs';

import { StrictOptions } from '../managers/options';

export function sync(fsAdapter: FileSystem<fs.Stats>, path: fs.PathLike, options: StrictOptions): fs.Stats {
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

export async function async(fsAdapter: FileSystem<Promise<fs.Stats>>, path: fs.PathLike, options: StrictOptions): Promise<fs.Stats> {
	const lstat = await fsAdapter.lstat(path);

	if (!isFollowedSymlink(lstat, options)) {
		return lstat;
	}

	try {
		const stat = await fsAdapter.stat(path);

		stat.isSymbolicLink = () => true;

		return stat;
	} catch (err) {
		if (!options.throwErrorOnBrokenSymlinks) {
			return lstat;
		}

		throw err;
	}
}

/**
 * Returns `true` for followed symlink.
 */
export function isFollowedSymlink(stat: fs.Stats, options: StrictOptions): boolean {
	return stat.isSymbolicLink() && options.followSymlinks;
}
