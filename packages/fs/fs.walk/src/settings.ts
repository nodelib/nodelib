import * as path from 'node:path';

import * as fsScandir from '@nodelib/fs.scandir';

import type { Entry, ErrnoException } from './types';

export type FilterFunction<T> = (value: T) => boolean;
export type DeepFilterFunction = FilterFunction<Entry>;
export type EntryFilterFunction = FilterFunction<Entry>;
export type ErrorFilterFunction = FilterFunction<ErrnoException>;

export interface Options {
	basePath?: string;
	concurrency?: number;
	deepFilter?: DeepFilterFunction;
	entryFilter?: EntryFilterFunction;
	errorFilter?: ErrorFilterFunction;
	followSymbolicLinks?: boolean;
	fs?: Partial<fsScandir.FileSystemAdapter>;
	pathSegmentSeparator?: string;
	stats?: boolean;
	throwErrorOnBrokenSymbolicLink?: boolean;
	signal?: AbortSignal;
}

export class Settings {
	public readonly basePath?: string;
	public readonly concurrency: number;
	public readonly deepFilter: DeepFilterFunction | null;
	public readonly entryFilter: EntryFilterFunction | null;
	public readonly errorFilter: ErrorFilterFunction | null;
	public readonly pathSegmentSeparator: string;
	public readonly fsScandirSettings: fsScandir.Settings;
	public readonly signal?: AbortSignal;

	constructor(options: Options = {}) {
		this.basePath = options.basePath ?? undefined;
		this.concurrency = options.concurrency ?? Number.POSITIVE_INFINITY;
		this.deepFilter = options.deepFilter ?? null;
		this.entryFilter = options.entryFilter ?? null;
		this.errorFilter = options.errorFilter ?? null;
		this.pathSegmentSeparator = options.pathSegmentSeparator ?? path.sep;
		this.signal = options.signal;

		this.fsScandirSettings = new fsScandir.Settings({
			followSymbolicLinks: options.followSymbolicLinks,
			fs: options.fs,
			pathSegmentSeparator: this.pathSegmentSeparator,
			stats: options.stats,
			throwErrorOnBrokenSymbolicLink: options.throwErrorOnBrokenSymbolicLink,
		});
	}
}
