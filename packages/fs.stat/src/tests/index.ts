import * as fs from 'fs';

import FileSystem, { AsyncCallback } from '../adapters/fs';

export enum StatType { lstat, stat }

export interface FSMockOptions {
	readonly isSymbolicLink?: boolean;
	readonly throwLStatError?: boolean;
	readonly throwStatError?: boolean;
}

export type StrictFSMockOptions = Required<FSMockOptions>;

export class FileSystemSyncFake extends FileSystem<fs.Stats> {
	private readonly opts: StrictFSMockOptions;

	constructor(private readonly options?: FSMockOptions) {
		super();

		this.opts = getFileSystemFakeOptions(this.options);
	}

	public lstat(): fs.Stats {
		if (this.opts.throwLStatError) {
			throw new Error(this.constructor.name);
		}

		return getFakeStats(StatType.lstat, this.opts.isSymbolicLink);
	}

	public stat(): fs.Stats {
		if (this.opts.throwStatError) {
			throw new Error(this.constructor.name);
		}

		return getFakeStats(StatType.stat, this.opts.isSymbolicLink);
	}
}

export class FileSystemAsyncFake extends FileSystem<void> {
	private readonly opts: StrictFSMockOptions;

	constructor(private readonly options?: FSMockOptions) {
		super();

		this.opts = getFileSystemFakeOptions(this.options);
	}

	public lstat(_path: fs.PathLike, callback: AsyncCallback): void {
		if (this.opts.throwLStatError) {
			const error = new Error(this.constructor.name);

			return callback(error);
		}

		const lstat = getFakeStats(StatType.lstat, this.opts.isSymbolicLink);

		callback(null, lstat);
	}

	public stat(_path: fs.PathLike, callback: AsyncCallback): void {
		if (this.opts.throwStatError) {
			const error = new Error(this.constructor.name);

			return callback(error);
		}

		const stat = getFakeStats(StatType.stat, this.opts.isSymbolicLink);

		callback(null, stat);
	}
}

function getFileSystemFakeOptions(options?: FSMockOptions): StrictFSMockOptions {
	return Object.assign<StrictFSMockOptions, FSMockOptions | undefined>({
		isSymbolicLink: false,
		throwLStatError: false,
		throwStatError: false
	}, options);
}

export function getFakeStats(statType: StatType, isSymbolicLink: boolean): fs.Stats {
	return {
		uid: statType,
		isSymbolicLink: () => isSymbolicLink
	} as fs.Stats;
}
