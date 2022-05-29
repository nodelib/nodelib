import * as fs from 'fs';

import type { PrepareOptionsFromClass } from './types';

const uid = process.platform === 'win32' ? undefined : process.getuid();
const gid = process.platform === 'win32' ? undefined : process.getgid();

type StatsOptions = PrepareOptionsFromClass<fs.Stats>;

export default class Stats extends fs.Stats {
	public readonly _date: Date = new Date();

	public override readonly dev: number = this._options.dev ?? 0;
	public override readonly ino: number = this._options.ino ?? 0;
	public override readonly mode: number = this._options.mode ?? 0;
	public override readonly nlink: number = this._options.nlink ?? 0;
	public override readonly uid: number = ('uid' in this._options ? this._options.uid : uid) as number;
	public override readonly gid: number = ('gid' in this._options ? this._options.gid : gid) as number;
	public override readonly rdev: number = this._options.rdev ?? 0;
	public override readonly size: number = this._options.size ?? 0;
	public override readonly blksize: number = this._options.blksize ?? 0;
	public override readonly blocks: number = this._options.blocks ?? 0;
	public override readonly atimeMs: number = this._options.atimeMs ?? this._date.getTime();
	public override readonly mtimeMs: number = this._options.mtimeMs ?? this._date.getTime();
	public override readonly ctimeMs: number = this._options.ctimeMs ?? this._date.getTime();
	public override readonly birthtimeMs: number = this._options.birthtimeMs ?? this._date.getTime();
	public override readonly atime: Date = this._options.atime ?? this._date;
	public override readonly mtime: Date = this._options.mtime ?? this._date;
	public override readonly ctime: Date = this._options.ctime ?? this._date;
	public override readonly birthtime: Date = this._options.birthtime ?? this._date;

	constructor(private readonly _options: StatsOptions = {}) {
		super();
	}

	public override isFile(): boolean {
		return this._options.isFile ?? true;
	}

	public override isDirectory(): boolean {
		return this._options.isDirectory ?? false;
	}

	public override isBlockDevice(): boolean {
		return this._options.isBlockDevice ?? false;
	}

	public override isCharacterDevice(): boolean {
		return this._options.isCharacterDevice ?? false;
	}

	public override isSymbolicLink(): boolean {
		return this._options.isSymbolicLink ?? false;
	}

	public override isFIFO(): boolean {
		return this._options.isFIFO ?? false;
	}

	public override isSocket(): boolean {
		return this._options.isSocket ?? false;
	}
}
