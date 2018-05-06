import * as fs from 'fs';

import FileSystem from '../adapters/fs';

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

export class FileSystemAsyncFake extends FileSystem<Promise<fs.Stats>> {
	private readonly opts: StrictFSMockOptions;

	constructor(private readonly options?: FSMockOptions) {
		super();

		this.opts = getFileSystemFakeOptions(this.options);
	}

	public lstat(): Promise<fs.Stats> {
		if (this.opts.throwLStatError) {
			const error = new Error(this.constructor.name);

			return Promise.reject(error);
		}

		const stat = getFakeStats(StatType.lstat, this.opts.isSymbolicLink);

		return Promise.resolve(stat);
	}

	public stat(): Promise<fs.Stats> {
		if (this.opts.throwStatError) {
			const error = new Error(this.constructor.name);

			return Promise.reject(error);
		}

		const stat = getFakeStats(StatType.stat, this.opts.isSymbolicLink);

		return Promise.resolve(stat);
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
