import * as fs from 'fs';

import * as fsStat from '@nodelib/fs.stat';

export interface FileSystemAdapter extends fsStat.FileSystemAdapter {
	readdir: typeof fs.readdir;
	readdirSync: typeof fs.readdirSync;
}

export const FILE_SYSTEM_ADAPTER: FileSystemAdapter = {
	lstat: fs.lstat,
	stat: fs.stat,
	lstatSync: fs.lstatSync,
	statSync: fs.statSync,
	readdir: fs.readdir,
	readdirSync: fs.readdirSync
};

export function getFileSystemAdapter(fsMethods?: Partial<FileSystemAdapter>): FileSystemAdapter {
	if (!fsMethods) {
		return FILE_SYSTEM_ADAPTER;
	}

	return {
		...FILE_SYSTEM_ADAPTER,
		...fsMethods
	};
}
