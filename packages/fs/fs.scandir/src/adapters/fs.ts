import * as fs from 'fs';

import type * as fsStat from '@nodelib/fs.stat';

import type { Dirent, ErrnoException } from '../types';

export interface ReaddirAsynchronousMethod {
	(filepath: string, options: { withFileTypes: true }, callback: (error: ErrnoException | null, files: Dirent[]) => void): void;
	(filepath: string, callback: (error: ErrnoException | null, files: string[]) => void): void;
}

export interface ReaddirSynchronousMethod {
	(filepath: string, options: { withFileTypes: true }): Dirent[];
	(filepath: string): string[];
}

export type FileSystemAdapter = fsStat.FileSystemAdapter & {
	readdir: ReaddirAsynchronousMethod;
	readdirSync: ReaddirSynchronousMethod;
};

export const FILE_SYSTEM_ADAPTER: FileSystemAdapter = {
	lstat: fs.lstat,
	stat: fs.stat,
	lstatSync: fs.lstatSync,
	statSync: fs.statSync,
	readdir: fs.readdir,
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
