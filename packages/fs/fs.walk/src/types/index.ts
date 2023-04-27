import type * as scandir from '@nodelib/fs.scandir';

export type Entry = scandir.Entry;
export type ErrnoException = NodeJS.ErrnoException;

export interface QueueItem {
	directory: string;
	base?: string;
}

export type EntryEventCallback = (entry: Entry) => void;
export type ErrorEventCallback = (error: ErrnoException) => void;
export type EndEventCallback = () => void;
