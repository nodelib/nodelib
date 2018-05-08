import { DirEntry } from '../types/entry';

export type PreFilterFunction = (name: string) => boolean;
export type FilterFunction = (entry: DirEntry) => boolean;
export type SortFunction = (a: DirEntry, b: DirEntry) => number;

export interface Options {
	stats?: boolean;
	followSymlinks?: boolean;
	throwErrorOnBrokenSymlinks?: boolean;
	preFilter?: PreFilterFunction | null;
	filter?: FilterFunction | null;
	sort?: SortFunction | null;
}

export type StrictOptions = Required<Options>;

export function prepare(options?: Options): StrictOptions {
	return Object.assign<StrictOptions, Options | undefined>({
		stats: false,
		followSymlinks: true,
		throwErrorOnBrokenSymlinks: true,
		preFilter: null,
		filter: null,
		sort: null
	}, options);
}
