import * as fsStat from '@nodelib/fs.stat';

import { IS_SUPPORT_READDIR_WITH_FILE_TYPES } from '../constants';
import Settings from '../settings';
import { Entry } from '../types/index';
import * as utils from '../utils/index';

export function read(dir: string, settings: Settings): Entry[] {
	if (!settings.stats && IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
		return readdirWithFileTypes(dir, settings);
	}

	return readdir(dir, settings);
}

export function readdirWithFileTypes(dir: string, settings: Settings): Entry[] {
	const dirents = settings.fs.readdirSync(dir, { withFileTypes: true });

	return dirents.map((dirent) => {
		const entry: Entry = {
			dirent,
			name: dirent.name,
			path: `${dir}${settings.pathSegmentSeparator}${dirent.name}`
		};

		if (entry.dirent.isSymbolicLink() && settings.followSymbolicLinks) {
			try {
				const stats = settings.fs.statSync(entry.path);

				entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
			} catch (error) {
				if (settings.throwErrorOnBrokenSymbolicLink) {
					throw error;
				}
			}
		}

		return entry;
	});
}

export function readdir(dir: string, settings: Settings): Entry[] {
	const names = settings.fs.readdirSync(dir);

	return names.map((name) => {
		const entryPath = `${dir}${settings.pathSegmentSeparator}${name}`;
		const stats = fsStat.statSync(entryPath, settings.fsStatSettings);

		const entry: Entry = {
			name,
			path: entryPath,
			dirent: utils.fs.createDirentFromStats(name, stats)
		};

		if (settings.stats) {
			entry.stats = stats;
		}

		return entry;
	});
}
