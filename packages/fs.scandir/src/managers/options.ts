import * as fsAdapter from '../adapters/fs';

import { FileSystemAdapter } from '../adapters/fs';
import { DirEntry } from '../types/entry';

export type PreFilterFunction = (name: string, path: string) => boolean;
export type FilterFunction = (entry: DirEntry) => boolean;
export type SortFunction = (a: DirEntry, b: DirEntry) => number;

export interface Options {
	fs?: Partial<FileSystemAdapter>;
	includeRootDirectory?: boolean;
	stats?: boolean;
	followSymlinks?: boolean;
	throwErrorOnBrokenSymlinks?: boolean;
	preFilter?: PreFilterFunction | null;
	filter?: FilterFunction | null;
	sort?: SortFunction | null;
}

export type StrictOptions = { fs: FileSystemAdapter } & Required<Options>;

export function prepare(opts?: Options): StrictOptions {
	const options = Object.assign<StrictOptions, Options | undefined>({
		fs: fsAdapter.getFileSystemAdapter(opts ? opts.fs : undefined),
		includeRootDirectory: false,
		stats: false,
		followSymlinks: true,
		throwErrorOnBrokenSymlinks: true,
		preFilter: null,
		filter: null,
		sort: null
	}, opts);

	return options;
}
