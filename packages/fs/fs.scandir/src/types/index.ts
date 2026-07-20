import type * as fs from 'node:fs';

export type Entry = {
	dirent: Dirent;
	name: string;
	path: string;
	stats?: Stats;
};

export type Dirent = fs.Dirent;
export type Stats = fs.Stats;
export type ErrnoException = NodeJS.ErrnoException;
// Node-style callbacks report successful completion with null.
// eslint-disable-next-line @typescript-eslint/no-restricted-types
export type AsyncCallback = (error: ErrnoException | null, entries: Entry[]) => void;
