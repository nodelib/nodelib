import type * as fs from 'fs';

export interface Entry {
	dirent: Dirent;
	name: string;
	path: string;
	stats?: Stats;
}

export type Stats = fs.Stats;
export type ErrnoException = NodeJS.ErrnoException;
export type AsyncCallback = (error: ErrnoException | null, entries: Entry[]) => void;

export interface Dirent {
	isBlockDevice: () => boolean;
	isCharacterDevice: () => boolean;
	isDirectory: () => boolean;
	isFIFO: () => boolean;
	isFile: () => boolean;
	isSocket: () => boolean;
	isSymbolicLink: () => boolean;
	name: string;
}
