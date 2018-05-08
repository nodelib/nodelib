import * as fs from 'fs';
import * as path from 'path';

import { FileSystemAsync, FileSystemSync } from '../adapters/fs';

import { StrictOptions } from '../managers/options';
import { DirEntry } from '../types/entry';

export function sync(fsAdapter: FileSystemSync, root: fs.PathLike, options: StrictOptions): DirEntry[] {
	const names = fsAdapter.readdir(root);

	const entries: DirEntry[] = [];

	for (const name of names) {
		if (options.preFilter && !options.preFilter(name)) {
			continue;
		}

		const fullPath = path.join(root.toString(), name);

		const stats = fsAdapter.stat(fullPath, {
			followSymlinks: options.followSymlinks,
			throwErrorOnBrokenSymlinks: options.throwErrorOnBrokenSymlinks
		});

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

export async function async(fsAdapter: FileSystemAsync, root: fs.PathLike, options: StrictOptions): Promise<DirEntry[]> {
	let names = await fsAdapter.readdir(root);

	if (options.preFilter) {
		names = names.filter(options.preFilter);
	}

	const fullPaths: string[] = [];
	const promises: Array<Promise<fs.Stats>> = [];

	for (const name of names) {
		const fullPath = path.join(root.toString(), name);
		const promise = fsAdapter.stat(fullPath, {
			followSymlinks: options.followSymlinks,
			throwErrorOnBrokenSymlinks: options.throwErrorOnBrokenSymlinks
		});

		fullPaths.push(fullPath);
		promises.push(promise);
	}

	const stats = await Promise.all(promises);

	const entries: DirEntry[] = [];

	for (let index = 0; index < names.length; index++) {
		const entry = makeDirEntry(names[index], fullPaths[index], stats[index], options);

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
