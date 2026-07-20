import * as fs from 'node:fs';
import type { ErrnoException } from '../types/index.js';

// Node-style callbacks report successful completion with null.
// eslint-disable-next-line @typescript-eslint/no-restricted-types
export type StatAsynchronousMethod = (path: string, callback: (error: ErrnoException | null, stats: fs.Stats) => void) => void;
export type StatSynchronousMethod = (path: string) => fs.Stats;

export type FileSystemAdapter = {
	lstat: StatAsynchronousMethod;
	stat: StatAsynchronousMethod;
	lstatSync: StatSynchronousMethod;
	statSync: StatSynchronousMethod;
};

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
