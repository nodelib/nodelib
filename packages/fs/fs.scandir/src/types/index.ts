import type * as fs from 'node:fs';

export interface Entry {
	dirent: Dirent;
	name: string;
	path: string;
	stats?: Stats;
}

export type Dirent = fs.Dirent;
export type Stats = fs.Stats;
export type ErrnoException = NodeJS.ErrnoException;
