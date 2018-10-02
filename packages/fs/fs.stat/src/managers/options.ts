import * as fsAdapter from '../adapters/fs';

import { FileSystemAdapter } from '../adapters/fs';

export interface Options {
	fs?: Partial<FileSystemAdapter>;
	throwErrorOnBrokenSymlinks?: boolean;
	followSymlinks?: boolean;
}

export type StrictOptions = { fs: FileSystemAdapter } & Required<Options>;

export function prepare(opts?: Options): StrictOptions {
	const options = Object.assign<StrictOptions, Options | undefined>({
		fs: fsAdapter.getFileSystemAdapter(opts ? opts.fs : undefined),
		throwErrorOnBrokenSymlinks: true,
		followSymlinks: true
	}, opts);

	return options;
}
