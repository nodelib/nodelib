import * as path from 'node:path';
import * as fsScandir from '@nodelib/fs.scandir';
import type { Entry, ErrnoException } from './types/index.js';

export type FilterFunction<T> = (value: T) => boolean;
export type DeepFilterFunction = FilterFunction<Entry>;
export type EntryFilterFunction = FilterFunction<Entry>;
export type ErrorFilterFunction = FilterFunction<ErrnoException>;

export type Options = {
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
};

export class Settings {
	public readonly basePath?: string;
	public readonly concurrency: number;
	// Filters default to null when they are not configured.
	// eslint-disable-next-line @typescript-eslint/no-restricted-types
	public readonly deepFilter: DeepFilterFunction | null;
	// eslint-disable-next-line @typescript-eslint/no-restricted-types
	public readonly entryFilter: EntryFilterFunction | null;
	// eslint-disable-next-line @typescript-eslint/no-restricted-types
	public readonly errorFilter: ErrorFilterFunction | null;
	public readonly pathSegmentSeparator: string;
	public readonly fsScandirSettings: fsScandir.Settings;
	public readonly signal?: AbortSignal;

	constructor(options: Options = {}) {
		this.basePath = options.basePath ?? undefined;
		this.concurrency = options.concurrency ?? Infinity;
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
