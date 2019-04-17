import * as fs from 'fs';
import * as path from 'path';

import * as fsStat from '@nodelib/fs.stat';
import rpl = require('run-parallel');

import { StrictOptions } from '../managers/options';
import { DirEntry } from '../types/entry';

export function sync(root: fs.PathLike, options: StrictOptions): DirEntry[] {
	let names = options.fs.readdirSync(root);

	if (options.includeRootDirectory) {
		names = [root.toString()].concat(names);
	}

	const fsStatOptions = getFsStatOptions(options);

	const entries: DirEntry[] = [];

	for (const name of names) {
		const fullPath = path.join(root.toString(), name);

		if (options.preFilter && !options.preFilter(name, fullPath)) {
			continue;
		}

		const stats = fsStat.statSync(fullPath, fsStatOptions);

		const entry = makeDirEntry(name, fullPath, stats, options);

		if (options.filter && !options.filter(entry)) {
			continue;
		}

		entries.push(entry);
	}

	if (options.sort) {
		return entries.sort(options.sort);
	}

	return entries;
}

export type AsyncCallback = (err: NodeJS.ErrnoException | null, stats?: DirEntry[]) => void;

export function async(root: fs.PathLike, options: StrictOptions, callback: AsyncCallback): void {
	const fsStatOptions = getFsStatOptions(options);

	options.fs.readdir(root, (err0, names) => {
		if (err0) {
			return callback(err0);
		}

		if (options.includeRootDirectory) {
			names = [root.toString()].concat(names); /* tslint:disable-line no-parameter-reassignment */
		}

		const preFilteredNames: string[] = [];
		const preFilteredPaths: string[] = [];
		const tasks: Array<rpl.Task<fs.Stats>> = [];

		for (const name of names) {
			const fullPath = path.join(root.toString(), name);

			if (options.preFilter && !options.preFilter(name, fullPath)) {
				continue;
			}

			preFilteredNames.push(name);
			preFilteredPaths.push(fullPath);

			const task: rpl.Task<fs.Stats> = (done) => fsStat.stat(fullPath, fsStatOptions, done);

			tasks.push(task);
		}

		rpl(tasks, (err1, stats) => {
			if (err1) {
				return callback(err1);
			}

			const entries: DirEntry[] = [];

			for (let index = 0; index < preFilteredNames.length; index++) {
				const name = preFilteredNames[index];
				const fullPath = preFilteredPaths[index];
				const stat = stats[index];

				const entry = makeDirEntry(name, fullPath, stat, options);

				if (options.filter && !options.filter(entry)) {
					continue;
				}

				entries.push(entry);
			}

			if (options.sort) {
				return callback(null, entries.sort(options.sort));
			}

			callback(null, entries);
		});
	});
}

function getFsStatOptions(options: fsStat.Options): fsStat.Options {
	return {
		fs: options.fs,
		followSymbolicLink: options.followSymbolicLink,
		throwErrorOnBrokenSymbolicLink: options.throwErrorOnBrokenSymbolicLink
	};
}

export function makeDirEntry(name: string, full: string, stats: fs.Stats, options: StrictOptions): DirEntry {
	const entry: DirEntry = {
		name,
		path: full,
		ino: stats.ino,
		isDirectory: stats.isDirectory(),
		isFile: stats.isFile(),
		isSymlink: stats.isSymbolicLink()
	};

	if (options.stats) {
		entry.stats = stats;
	}

	return entry;
}
