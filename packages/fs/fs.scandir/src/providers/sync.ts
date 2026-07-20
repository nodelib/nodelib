import * as fsStat from '@nodelib/fs.stat';

import * as fsUtils from '../utils/fs.js';
import * as common from './common.js';

import type { Settings } from '../settings.js';
import type { Entry, ErrnoException } from '../types/index.js';

export function read(directory: string, settings: Settings): Entry[] {
	const dirents = settings.fs.readdirSync(directory, { withFileTypes: true });

	return dirents.map((dirent) => {
		const entry: Entry = {
			dirent,
			name: dirent.name,
			path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator),
		};

		if (settings.stats) {
			entry.stats = fsStat.statSync(entry.path, settings.fsStatSettings);
		}

		if (settings.followSymbolicLinks && entry.dirent.isSymbolicLink()) {
			try {
				const stats = entry.stats ?? settings.fs.statSync(entry.path);

				entry.dirent = fsUtils.createDirentFromStats(entry.name, stats, directory);
			} catch (error: unknown) {
				if (settings.throwErrorOnBrokenSymbolicLink) {
					throw (error as ErrnoException);
				}
			}
		}

		return entry;
	});
}
