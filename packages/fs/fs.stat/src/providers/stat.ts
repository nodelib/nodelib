import * as fs from 'fs';

import { StrictOptions } from '../managers/options';

export function sync(path: fs.PathLike, options: StrictOptions): fs.Stats {
	const lstat = options.fs.lstatSync(path);

	if (!isFollowedSymlink(lstat, options)) {
		return lstat;
	}

	try {
		const stat = options.fs.statSync(path);

		stat.isSymbolicLink = () => true;

		return stat;
	} catch (err) {
		if (!options.throwErrorOnBrokenSymlinks) {
			return lstat;
		}

		throw err;
	}
}

export type AsyncCallback = (err: NodeJS.ErrnoException | null, stats?: fs.Stats) => void;

export function async(path: fs.PathLike, options: StrictOptions, callback: AsyncCallback): void {
	options.fs.lstat(path, (err0, lstat) => {
		if (err0) {
			return callback(err0, undefined);
		}

		if (!isFollowedSymlink(lstat, options)) {
			return callback(null, lstat);
		}

		options.fs.stat(path, (err1, stat) => {
			if (err1) {
				return options.throwErrorOnBrokenSymlinks ? callback(err1) : callback(null, lstat);
			}

			stat.isSymbolicLink = () => true;

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
