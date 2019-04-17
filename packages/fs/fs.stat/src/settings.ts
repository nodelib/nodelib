import * as fs from './adapters/fs';

export interface Options {
	followSymbolicLink?: boolean;
	fs?: Partial<fs.FileSystemAdapter>;
	markSymbolicLink?: boolean;
	throwErrorOnBrokenSymbolicLink?: boolean;
}

export default class Settings {
	private readonly _followSymbolicLink: boolean;
	private readonly _fs: fs.FileSystemAdapter;
	private readonly _markSymbolicLink: boolean;
	private readonly _throwErrorOnBrokenSymbolicLink: boolean;

	constructor(private readonly _options: Options = {}) {
		this._followSymbolicLink = this._setDefaultValue(this._options.followSymbolicLink, true);
		this._fs = fs.createFileSystemAdapter(this._options.fs);
		this._markSymbolicLink = this._setDefaultValue(this._options.markSymbolicLink, false);
		this._throwErrorOnBrokenSymbolicLink = this._setDefaultValue(this._options.throwErrorOnBrokenSymbolicLink, true);
	}

	public get followSymbolicLink(): boolean {
		return this._followSymbolicLink;
	}

	public get fs(): fs.FileSystemAdapter {
		return this._fs;
	}

	public get markSymbolicLink(): boolean {
		return this._markSymbolicLink;
	}

	public get throwErrorOnBrokenSymbolicLink(): boolean {
		return this._throwErrorOnBrokenSymbolicLink;
	}

	private _setDefaultValue<T>(option: T | undefined, value: T): T {
		return option === undefined ? value : option;
	}
}
