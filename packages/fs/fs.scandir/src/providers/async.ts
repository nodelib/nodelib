import * as path from 'path';

import * as fsStat from '@nodelib/fs.stat';
import * as rpl from 'run-parallel';

import { IS_SUPPORT_READDIR_WITH_FILE_TYPES } from '../constants';
import Settings from '../settings';
import { Entry, Stats } from '../types/index';
import * as utils from '../utils/index';

type RplTaskStats = rpl.Task<Stats>;
type RplTaskEntry = rpl.Task<Entry>;
type FailureCallback = (err: NodeJS.ErrnoException) => void;
type SuccessCallback = (err: null, entries: Entry[]) => void;

export type AsyncCallback = (err: NodeJS.ErrnoException, entries: Entry[]) => void;

export function read(dir: string, settings: Settings, callback: AsyncCallback): void {
	if (!settings.stats && IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
		return readdirWithFileTypes(dir, settings, callback);
	}

	return readdir(dir, settings, callback);
}

export function readdirWithFileTypes(dir: string, settings: Settings, callback: AsyncCallback): void {
	settings.fs.readdir(dir, { withFileTypes: true }, (readdirError, dirents) => {
		if (readdirError) {
			return callFailureCallback(callback, readdirError);
		}

		const entries: Entry[] = dirents.map((dirent) => ({
			dirent,
			name: dirent.name,
			path: `${dir}${path.sep}${dirent.name}`
		}));

		if (!settings.followSymbolicLinks) {
			return callSuccessCallback(callback, entries);
		}

		const tasks: RplTaskEntry[] = entries.map((entry) => makeRplTaskEntry(entry, settings));

		rpl(tasks, (rplError, rplEntries) => {
			if (rplError) {
				return callFailureCallback(callback, rplError);
			}

			callSuccessCallback(callback, rplEntries);
		});
	});
}

function makeRplTaskEntry(entry: Entry, settings: Settings): RplTaskEntry {
	return (done) => {
		if (!entry.dirent.isSymbolicLink()) {
			return done(null, entry);
		}

		settings.fs.stat(entry.path, (statError, stats) => {
			if (statError) {
				if (settings.throwErrorOnBrokenSymbolicLink) {
					return done(statError);
				}

				return done(null, entry);
			}

			entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);

			return done(null, entry);
		});
	};
}

export function readdir(dir: string, settings: Settings, callback: AsyncCallback): void {
	settings.fs.readdir(dir, (readdirError, names) => {
		if (readdirError) {
			return callFailureCallback(callback, readdirError);
		}

		const filepaths = names.map((name) => `${dir}${path.sep}${name}`);

		const tasks: RplTaskStats[] = filepaths.map((filepath): RplTaskStats => {
			return (done) => fsStat.stat(filepath, settings.fsStatSettings, done);
		});

		rpl(tasks, (rplError, results) => {
			if (rplError) {
				return callFailureCallback(callback, rplError);
			}

			const entries: Entry[] = [];

			for (let index = 0; index < names.length; index++) {
				const name = names[index];
				const stats = results[index];

				const entry: Entry = {
					name,
					path: filepaths[index],
					dirent: utils.fs.createDirentFromStats(name, stats)
				};

				if (settings.stats) {
					entry.stats = stats;
				}

				entries.push(entry);
			}

			callSuccessCallback(callback, entries);
		});
	});
}

function callFailureCallback(callback: AsyncCallback, error: NodeJS.ErrnoException): void {
	(callback as FailureCallback)(error);
}

function callSuccessCallback(callback: AsyncCallback, result: Entry[]): void {
	(callback as unknown as SuccessCallback)(null, result);
}
