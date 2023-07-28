import * as fs from 'node:fs';

import type { ErrnoException } from '../types';

export type StatAsynchronousMethod = (path: string, callback: (error: ErrnoException | null, stats: fs.Stats) => void) => void;
export type StatSynchronousMethod = (path: string) => fs.Stats;

export interface FileSystemAdapter {
	lstat: StatAsynchronousMethod;
	stat: StatAsynchronousMethod;
	lstatSync: StatSynchronousMethod;
	statSync: StatSynchronousMethod;
}

export const FILE_SYSTEM_ADAPTER: FileSystemAdapter = {
	lstat: fs.lstat,
	stat: fs.stat,
	lstatSync: fs.lstatSync,
	statSync: fs.statSync,
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
