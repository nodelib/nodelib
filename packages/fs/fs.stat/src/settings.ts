import * as fs from './adapters/fs';

export interface Options {
	followSymbolicLink?: boolean;
	fs?: Partial<fs.FileSystemAdapter>;
	markSymbolicLink?: boolean;
	throwErrorOnBrokenSymbolicLink?: boolean;
}

export default class Settings {
	public readonly followSymbolicLink: boolean;
	public readonly fs: fs.FileSystemAdapter;
	public readonly markSymbolicLink: boolean;
	public readonly throwErrorOnBrokenSymbolicLink: boolean;

	constructor(options: Options = {}) {
		this.followSymbolicLink = options.followSymbolicLink ?? true;
		this.fs = fs.createFileSystemAdapter(options.fs);
		this.markSymbolicLink = options.markSymbolicLink ?? false;
		this.throwErrorOnBrokenSymbolicLink = options.throwErrorOnBrokenSymbolicLink ?? true;
	}
}
