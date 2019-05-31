import * as fsScandir from '@nodelib/fs.scandir';

import { Entry, Errno } from './types/index';

export type FilterFunction<T> = (value: T) => boolean;
export type DeepFilterFunction = FilterFunction<Entry>;
export type EntryFilterFunction = FilterFunction<Entry>;
export type ErrorFilterFunction = FilterFunction<Errno>;

export interface Options {
	basePath?: string | null;
	concurrency?: number;
	deepFilter?: DeepFilterFunction;
	entryFilter?: EntryFilterFunction;
	errorFilter?: ErrorFilterFunction;
	followSymbolicLinks?: boolean;
	fs?: Partial<fsScandir.FileSystemAdapter>;
	stats?: boolean;
	throwErrorOnBrokenSymbolicLink?: boolean;
}

export default class Settings {
	public readonly basePath: string | null = this._getValue(this._options.basePath, null);
	public readonly concurrency: number = this._getValue(this._options.concurrency, Infinity);
	public readonly deepFilter: DeepFilterFunction | null = this._getValue(this._options.deepFilter, null);
	public readonly entryFilter: EntryFilterFunction | null = this._getValue(this._options.entryFilter, null);
	public readonly errorFilter: ErrorFilterFunction | null = this._getValue(this._options.errorFilter, null);

	public readonly fsScandirSettings: fsScandir.Settings = new fsScandir.Settings({
		fs: this._options.fs,
		stats: this._options.stats,
		followSymbolicLinks: this._options.followSymbolicLinks,
		throwErrorOnBrokenSymbolicLink: this._options.throwErrorOnBrokenSymbolicLink
	});

	constructor(private readonly _options: Options = {}) { }

	private _getValue<T>(option: T | undefined, value: T): T {
		return option === undefined ? value : option;
	}
}
