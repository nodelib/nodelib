import * as fsScandir from '@nodelib/fs.scandir';

import { Entry, Errno } from './types/index';

export type FilterFunction<T> = (value: T) => boolean;
export type DeepFilterFunction = FilterFunction<Entry>;
export type EntryFilterFunction = FilterFunction<Entry>;
export type ErrorFilterFunction = FilterFunction<Errno>;

export interface Options {
	concurrency?: number;
	deepFilter?: DeepFilterFunction | null;
	entryFilter?: EntryFilterFunction;
	errorFilter?: ErrorFilterFunction;
	followSymbolicLinks?: boolean;
	fs?: Partial<fsScandir.FileSystemAdapter>;
	stats?: boolean;
	throwErrorOnBrokenSymbolicLink?: boolean;
}

export default class Settings {
	private readonly _concurrency: number;
	private readonly _deepFilter: DeepFilterFunction | null;
	private readonly _entryFilter: EntryFilterFunction | null;
	private readonly _errorFilter: ErrorFilterFunction | null;
	private readonly _fsScandirSettings: fsScandir.Settings;

	constructor(private readonly _options: Options = {}) {
		this._concurrency = this._setDefaultValue(this._options.concurrency, Infinity);
		this._deepFilter = this._setDefaultValue(this._options.deepFilter, null);
		this._entryFilter = this._setDefaultValue(this._options.entryFilter, null);
		this._errorFilter = this._setDefaultValue(this._options.errorFilter, null);

		this._fsScandirSettings = new fsScandir.Settings({
			fs: this._options.fs,
			stats: this._options.stats,
			followSymbolicLinks: this._options.followSymbolicLinks,
			throwErrorOnBrokenSymbolicLink: this._options.throwErrorOnBrokenSymbolicLink
		});
	}

	public get concurrency(): number {
		return this._concurrency;
	}

	public get deepFilter(): DeepFilterFunction | null {
		return this._deepFilter;
	}

	public get entryFilter(): EntryFilterFunction | null {
		return this._entryFilter;
	}

	public get errorFilter(): ErrorFilterFunction | null {
		return this._errorFilter;
	}

	public get fsScandirSettings(): fsScandir.Settings {
		return this._fsScandirSettings;
	}

	private _setDefaultValue<T>(option: T | undefined, value: T): T {
		return option === undefined ? value : option;
	}
}
