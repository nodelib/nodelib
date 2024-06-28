import * as fs from 'node:fs';

export type StatAsynchronousMethod = (path: string) => Promise<fs.Stats>;
export type StatSynchronousMethod = (path: string) => fs.Stats;

export interface FileSystemAdapter {
	lstat: StatAsynchronousMethod;
	stat: StatAsynchronousMethod;
	lstatSync: StatSynchronousMethod;
	statSync: StatSynchronousMethod;
}

export const FILE_SYSTEM_ADAPTER: FileSystemAdapter = {
	lstat: fs.promises.lstat,
	stat: fs.promises.stat,
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
