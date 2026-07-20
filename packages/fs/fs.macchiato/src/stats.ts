import * as fs from 'node:fs';

import type { PrepareOptionsFromClass } from './types.js';

const uid = process.getuid?.();
const gid = process.getgid?.();

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

type StatsOptions = {
	mode?: StatsMode;
} & PrepareOptionsFromClass<fs.Stats>;

type StatsConstructor = new (options?: StatsOptions) => Stats;

export type Stats = fs.Stats;

function createStats(options: StatsOptions = {}): Stats {
	const date = new Date();
	const stats = fs.statSync(process.execPath);

	stats.dev = options.dev ?? 0;
	stats.ino = options.ino ?? 0;
	stats.mode = options.mode ?? StatsMode.Unknown;
	stats.nlink = options.nlink ?? 0;
	stats.uid = ('uid' in options ? options.uid : uid) as number;
	stats.gid = ('gid' in options ? options.gid : gid) as number;
	stats.rdev = options.rdev ?? 0;
	stats.size = options.size ?? 0;
	stats.blksize = options.blksize ?? 0;
	stats.blocks = options.blocks ?? 0;
	stats.atimeMs = options.atimeMs ?? date.getTime();
	stats.mtimeMs = options.mtimeMs ?? date.getTime();
	stats.ctimeMs = options.ctimeMs ?? date.getTime();
	stats.birthtimeMs = options.birthtimeMs ?? date.getTime();
	stats.atime = options.atime ?? new Date(stats.atimeMs);
	stats.mtime = options.mtime ?? new Date(stats.mtimeMs);
	stats.ctime = options.ctime ?? new Date(stats.ctimeMs);
	stats.birthtime = options.birthtime ?? new Date(stats.birthtimeMs);

	return stats;
}

// A value and a type intentionally share the public constructor name.
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Stats = createStats as unknown as StatsConstructor;
