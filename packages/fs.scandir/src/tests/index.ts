import * as fs from 'fs';

import FileSystem from '../adapters/fs';

const DEFAULT_ENTRIES = ['.a', 'bbb', 'c', 'd', 'eeee', 'f'];

export interface FSMockOptions {
	throwReaddirError?: boolean;
	throwStatError?: boolean;
}

export type StrictFSMockOptions = Required<FSMockOptions>;

export class FileSystemSyncFake extends FileSystem<string[], fs.Stats> {
	private readonly error: Error = new Error(this.constructor.name);
	private readonly opts: StrictFSMockOptions;

	constructor(private readonly options?: FSMockOptions) {
		super();

		this.opts = getFileSystemFakeOptions(this.options);
	}

	public readdir(): string[] {
		if (this.opts.throwReaddirError) {
			throw this.error;
		}

		return DEFAULT_ENTRIES;
	}

	public stat(): fs.Stats {
		if (this.opts.throwStatError) {
			throw this.error;
		}

		return getFakeStats();
	}
}

export class FileSystemAsyncFake extends FileSystem<Promise<string[]>, Promise<fs.Stats>> {
	private readonly error: Error = new Error(this.constructor.name);
	private readonly opts: StrictFSMockOptions;

	constructor(private readonly options?: FSMockOptions) {
		super();

		this.opts = getFileSystemFakeOptions(this.options);
	}

	public readdir(): Promise<string[]> {
		if (this.opts.throwReaddirError) {
			return Promise.reject(this.error);
		}

		return Promise.resolve(DEFAULT_ENTRIES);
	}

	public stat(): Promise<fs.Stats> {
		if (this.opts.throwStatError) {
			return Promise.reject(this.error);
		}

		const stats = getFakeStats();

		return Promise.resolve(stats);
	}
}

function getFileSystemFakeOptions(options?: FSMockOptions): StrictFSMockOptions {
	return Object.assign<StrictFSMockOptions, FSMockOptions | undefined>({
		throwReaddirError: false,
		throwStatError: false
	}, options);
}

export function getFakeStats(): fs.Stats {
	return {
		ino: 0,
		isFile: () => true,
		isDirectory: () => false,
		isSymbolicLink: () => false
	} as fs.Stats;
}
