import * as fsStat from '@nodelib/fs.stat';

import * as utils from '../utils';
import * as common from './common';

import type { Settings } from '../settings';
import type { Entry } from '../types';

export async function read(directory: string, settings: Settings): Promise<Entry[]> {
	const dirents = await settings.fs.readdir(directory, { withFileTypes: true });
	const entries: Entry[] = dirents.map((dirent) => ({
		dirent,
		name: dirent.name,
		path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator),
	}));

	if (!settings.stats && !settings.followSymbolicLinks) {
		return entries;
	}

	const tasks = [];
	for (const entry of entries) {
		const action = getStatsAction(entry, settings);

		if (action !== undefined) {
			tasks.push(action.then((stats) => {
				if (settings.stats) {
					entry.stats = stats;
				}

				if (settings.followSymbolicLinks) {
					entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
				}

				return entry;
			}, (error) => {
				if (settings.throwErrorOnBrokenSymbolicLink) {
					throw error;
				}

				return entry;
			}));
		}
	}

	return Promise.all(tasks);
}

function getStatsAction(entry: Entry, settings: Settings): Promise<fsStat.Stats> | undefined {
	if (settings.stats) {
		return fsStat.stat(entry.path, settings.fsStatSettings);
	}

	if (settings.followSymbolicLinks && entry.dirent.isSymbolicLink()) {
		return settings.fs.stat(entry.path);
	}

	return undefined;
}
