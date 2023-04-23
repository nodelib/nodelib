import * as fs from 'fs';

import type { PrepareOptionsFromClass } from './types';

const isWindows = process.platform === 'win32';

const uid = isWindows ? undefined : process.getuid();
const gid = isWindows ? undefined : process.getgid();

// https://github.com/nodejs/node/blob/6675505686310771b8016805a381945826aad887/typings/internalBinding/constants.d.ts#L148-L154
export enum StatsMode {
	Unknown = 0,
	File = 32_768,
	Directory = 16_384,
	Link = 40_960,
	Fifo = 4096,
	Socket = 49_152,
	Char = 8192,
	Block = 24_576,
}

type StatsOptions = PrepareOptionsFromClass<fs.Stats> & {
	mode?: StatsMode;
};

export class Stats extends fs.Stats implements fs.Stats {
	constructor(options: StatsOptions = {}) {
		const date = new Date();

		super(
			// @ts-expect-error Types do not provide arguments.
			// https://github.com/nodejs/node/blob/6675505686310771b8016805a381945826aad887/lib/internal/fs/utils.js#L501-L503
			options.dev ?? 0,
			options.mode ?? StatsMode.Unknown,
			options.nlink ?? 0,
			'uid' in options ? options.uid : uid,
			'gid' in options ? options.gid : gid,
			options.rdev ?? 0,
			options.blksize ?? 0,
			options.ino ?? 0,
			options.size ?? 0,
			options.blocks ?? 0,
			options.atimeMs ?? date.getTime(),
			options.mtimeMs ?? date.getTime(),
			options.ctimeMs ?? date.getTime(),
			options.birthtimeMs ?? date.getTime(),
		);
	}
}
