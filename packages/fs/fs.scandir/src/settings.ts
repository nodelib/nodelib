import * as fsStat from '@nodelib/fs.stat';

import * as fs from './adapters/fs';

export interface Options {
	followSymbolicLinks?: boolean;
	fs?: Partial<fs.FileSystemAdapter>;
	stats?: boolean;
	throwErrorOnBrokenSymbolicLink?: boolean;
}

export default class Settings {
	private readonly _followSymbolicLinks: boolean;
	private readonly _fs: fs.FileSystemAdapter;
	private readonly _stats: boolean;
	private readonly _throwErrorOnBrokenSymbolicLink: boolean;

	private readonly _fsStatSettings: fsStat.Settings;

	constructor(private readonly _options: Options = {}) {
		this._followSymbolicLinks = this._setDefaultValue(this._options.followSymbolicLinks, false);
		this._fs = fs.createFileSystemAdapter(this._options.fs);
		this._stats = this._setDefaultValue(this._options.stats, false);
		this._throwErrorOnBrokenSymbolicLink = this._setDefaultValue(this._options.throwErrorOnBrokenSymbolicLink, true);

		this._fsStatSettings = new fsStat.Settings({
			followSymbolicLink: this._followSymbolicLinks,
			fs: this._fs,
			throwErrorOnBrokenSymbolicLink: this._throwErrorOnBrokenSymbolicLink
		});
	}

	public get followSymbolicLinks(): boolean {
		return this._followSymbolicLinks;
	}

	public get fs(): fs.FileSystemAdapter {
		return this._fs;
	}

	public get stats(): boolean {
		return this._stats;
	}

	public get throwErrorOnBrokenSymbolicLink(): boolean {
		return this._throwErrorOnBrokenSymbolicLink;
	}

	public get fsStatSettings(): fsStat.Settings {
		return this._fsStatSettings;
	}

	private _setDefaultValue<T>(option: T | undefined, value: T): T {
		return option === undefined ? value : option;
	}
}
