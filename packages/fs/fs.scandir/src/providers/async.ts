import * as fsStat from '@nodelib/fs.stat';
import * as rpl from 'run-parallel';

import { IS_SUPPORT_READDIR_WITH_FILE_TYPES } from '../constants';
import type Settings from '../settings';
import type { Entry, Stats } from '../types';
import * as utils from '../utils';
import * as common from './common';

type RplTaskStats = rpl.Task<Stats>;
type RplTaskEntry = rpl.Task<Entry>;
type FailureCallback = (error: NodeJS.ErrnoException) => void;
type SuccessCallback = (error: null, entries: Entry[]) => void;

export type AsyncCallback = (error: NodeJS.ErrnoException, entries: Entry[]) => void;

export function read(directory: string, settings: Settings, callback: AsyncCallback): void {
	if (!settings.stats && IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
		readdirWithFileTypes(directory, settings, callback);
		return;
	}

	readdir(directory, settings, callback);
}

export function readdirWithFileTypes(directory: string, settings: Settings, callback: AsyncCallback): void {
	settings.fs.readdir(directory, { withFileTypes: true }, (readdirError, dirents) => {
		if (readdirError !== null) {
			callFailureCallback(callback, readdirError);
			return;
		}

		const entries: Entry[] = dirents.map((dirent) => ({
			dirent,
			name: dirent.name,
			path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
		}));

		if (!settings.followSymbolicLinks) {
			callSuccessCallback(callback, entries);
			return;
		}

		const tasks: RplTaskEntry[] = entries.map((entry) => makeRplTaskEntry(entry, settings));

		rpl(tasks, (rplError: Error | null, rplEntries) => {
			if (rplError !== null) {
				callFailureCallback(callback, rplError);
				return;
			}

			callSuccessCallback(callback, rplEntries);
		});
	});
}

function makeRplTaskEntry(entry: Entry, settings: Settings): RplTaskEntry {
	return (done) => {
		if (!entry.dirent.isSymbolicLink()) {
			done(null, entry);
			return;
		}

		settings.fs.stat(entry.path, (statError, stats) => {
			if (statError !== null) {
				if (settings.throwErrorOnBrokenSymbolicLink) {
					done(statError);
					return;
				}

				done(null, entry);
				return;
			}

			entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);

			done(null, entry);
		});
	};
}

export function readdir(directory: string, settings: Settings, callback: AsyncCallback): void {
	settings.fs.readdir(directory, (readdirError, names) => {
		if (readdirError !== null) {
			callFailureCallback(callback, readdirError);
			return;
		}

		const filepaths = names.map((name) => common.joinPathSegments(directory, name, settings.pathSegmentSeparator));

		const tasks: RplTaskStats[] = filepaths.map((filepath): RplTaskStats => {
			return (done) => {
				fsStat.stat(filepath, settings.fsStatSettings, done);
			};
		});

		rpl(tasks, (rplError: Error | null, results) => {
			if (rplError !== null) {
				callFailureCallback(callback, rplError);
				return;
			}

			const entries: Entry[] = [];

			names.forEach((name, index) => {
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
			});

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
