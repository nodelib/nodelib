import * as fs from 'fs';
import * as path from 'path';

import { FileSystemAsync, FileSystemSync } from '../adapters/fs';

import { StrictOptions } from '../managers/options';
import { DirEntry } from '../types/entry';

export function sync(fsAdapter: FileSystemSync, root: fs.PathLike, options: StrictOptions): DirEntry[] {
	const names = fsAdapter.readdir(root);

	const entries: DirEntry[] = [];

	for (const name of names) {
		const fullPath = path.join(root.toString(), name);

		if (options.preFilter && !options.preFilter(name, fullPath)) {
			continue;
		}

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
	const names = await fsAdapter.readdir(root);

	const fullPaths: string[] = names.map((name) => path.join(root.toString(), name));

	let filteredNames: string[] = [];
	let filteredFullPaths: string[] = [];

	if (options.preFilter) {
		for (let index = 0; index < names.length; index++) {
			const name = names[index];
			const fullPath = fullPaths[index];

			if (options.preFilter(name, fullPath)) {
				filteredNames.push(name);
				filteredFullPaths.push(fullPath);
			}
		}
	} else {
		filteredNames = names;
		filteredFullPaths = fullPaths;
	}

	const promises: Array<Promise<fs.Stats>> = filteredFullPaths.map((fullPath) => fsAdapter.stat(fullPath, {
		followSymlinks: options.followSymlinks,
		throwErrorOnBrokenSymlinks: options.throwErrorOnBrokenSymlinks
	}));

	const stats = await Promise.all(promises);

	const entries: DirEntry[] = [];

	for (let index = 0; index < filteredNames.length; index++) {
		const name = filteredNames[index];
		const fullPath = filteredFullPaths[index];

		const entry = makeDirEntry(name, fullPath, stats[index], options);

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
