import * as fs from 'node:fs';

import type * as fsStat from '@nodelib/fs.stat';
import type { Dirent } from '../types';

export type ReaddirAsynchronousMethod = (filepath: string, options: { withFileTypes: true }) => Promise<Dirent[]>;
export type ReaddirSynchronousMethod = (filepath: string, options: { withFileTypes: true }) => Dirent[];

export type FileSystemAdapter = fsStat.FileSystemAdapter & {
	readdir: ReaddirAsynchronousMethod;
	readdirSync: ReaddirSynchronousMethod;
};

export const FILE_SYSTEM_ADAPTER: FileSystemAdapter = {
	lstat: fs.promises.lstat,
	stat: fs.promises.stat,
	lstatSync: fs.lstatSync,
	statSync: fs.statSync,
	readdir: fs.promises.readdir,
	readdirSync: fs.readdirSync,
};

export function createFileSystemAdapter(fsMethods?: Partial<FileSystemAdapter>): FileSystemAdapter {
	if (fsMethods === undefined) {
		return FILE_SYSTEM_ADAPTER;
	}

	return {
		...FILE_SYSTEM_ADAPTER,
		...fsMethods,
	};
}
