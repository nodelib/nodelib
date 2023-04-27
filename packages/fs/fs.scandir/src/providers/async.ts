import * as fsStat from '@nodelib/fs.stat';
import * as rpl from 'run-parallel';

import * as utils from '../utils';
import * as common from './common';

import type { Settings } from '../settings';
import type { AsyncCallback, Entry, ErrnoException } from '../types';

type RplTaskEntry = rpl.Task<Entry>;
type StatsAction = (callback: fsStat.AsyncCallback) => void;

type FailureCallback = (error: ErrnoException | null) => void;

export function read(directory: string, settings: Settings, callback: AsyncCallback): void {
	settings.fs.readdir(directory, { withFileTypes: true }, (readdirError, dirents) => {
		if (readdirError !== null) {
			callFailureCallback(callback, readdirError);
			return;
		}

		const entries = dirents.map((dirent) => ({
			dirent,
			name: dirent.name,
			path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator),
		}));

		if (!settings.stats && !settings.followSymbolicLinks) {
			callSuccessCallback(callback, entries);
			return;
		}

		const tasks = makeRplTasks(entries, settings);

		rpl(tasks, (rplError: Error | null) => {
			if (rplError !== null) {
				callFailureCallback(callback, rplError);
				return;
			}

			callSuccessCallback(callback, entries);
		});
	});
}

function makeRplTasks(entries: Entry[], settings: Settings): RplTaskEntry[] {
	const tasks: RplTaskEntry[] = [];

	for (const entry of entries) {
		const task = makeRplTask(entry, settings);

		if (task !== undefined) {
			tasks.push(task);
		}
	}

	return tasks;
}

/**
 * The task mutates the incoming entry object depending on the settings.
 * Returns the task, or undefined if the task is empty.
 */
function makeRplTask(entry: Entry, settings: Settings): RplTaskEntry | undefined {
	const action = getStatsAction(entry, settings);

	if (action === undefined) {
		return undefined;
	}

	return (done) => {
		action((error, stats) => {
			if (error !== null) {
				done(settings.throwErrorOnBrokenSymbolicLink ? error : null);
				return;
			}

			if (settings.stats) {
				entry.stats = stats;
			}

			if (settings.followSymbolicLinks) {
				entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
			}

			done(null, entry);
		});
	};
}

function getStatsAction(entry: Entry, settings: Settings): StatsAction | undefined {
	if (settings.stats) {
		return (callback) => {
			fsStat.stat(entry.path, settings.fsStatSettings, callback);
		};
	}

	if (settings.followSymbolicLinks && entry.dirent.isSymbolicLink()) {
		return (callback) => {
			settings.fs.stat(entry.path, callback);
		};
	}

	return undefined;
}

function callFailureCallback(callback: AsyncCallback, error: ErrnoException | null): void {
	(callback as FailureCallback)(error);
}

function callSuccessCallback(callback: AsyncCallback, result: Entry[]): void {
	callback(null, result);
}
