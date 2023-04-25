import * as path from 'path';

import * as fsStat from '@nodelib/fs.stat';

import * as fs from './adapters/fs';

export interface Options {
	followSymbolicLinks?: boolean;
	fs?: Partial<fs.FileSystemAdapter>;
	pathSegmentSeparator?: string;
	stats?: boolean;
	throwErrorOnBrokenSymbolicLink?: boolean;
}

export default class Settings {
	public readonly followSymbolicLinks: boolean;
	public readonly fs: fs.FileSystemAdapter;
	public readonly pathSegmentSeparator: string;
	public readonly stats: boolean;
	public readonly throwErrorOnBrokenSymbolicLink: boolean;
	public readonly fsStatSettings: fsStat.Settings;

	constructor(options: Options = {}) {
		this.followSymbolicLinks = options.followSymbolicLinks ?? false;
		this.fs = fs.createFileSystemAdapter(options.fs);
		this.pathSegmentSeparator = options.pathSegmentSeparator ?? path.sep;
		this.stats = options.stats ?? false;
		this.throwErrorOnBrokenSymbolicLink = options.throwErrorOnBrokenSymbolicLink ?? true;

		this.fsStatSettings = new fsStat.Settings({
			followSymbolicLink: this.followSymbolicLinks,
			fs: this.fs,
			throwErrorOnBrokenSymbolicLink: this.throwErrorOnBrokenSymbolicLink,
		});
	}
}
