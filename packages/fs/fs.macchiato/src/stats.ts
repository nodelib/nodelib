import * as fs from 'fs';

import { PrepareOptionsFromClass } from './types';

const uid = process.platform === 'win32' ? undefined : process.getuid();
const gid = process.platform === 'win32' ? undefined : process.getgid();

export default class Stats implements fs.Stats {
	public readonly _date: Date = new Date();

	public readonly dev: number = this._options.dev ?? 0;
	public readonly ino: number = this._options.ino ?? 0;
	public readonly mode: number = this._options.mode ?? 0;
	public readonly nlink: number = this._options.nlink ?? 0;
	public readonly uid: number = ('uid' in this._options ? this._options.uid : uid) as number;
	public readonly gid: number = ('gid' in this._options ? this._options.gid : gid) as number;
	public readonly rdev: number = this._options.rdev ?? 0;
	public readonly size: number = this._options.size ?? 0;
	public readonly blksize: number = this._options.blksize ?? 0;
	public readonly blocks: number = this._options.blocks ?? 0;
	public readonly atimeMs: number = this._options.atimeMs ?? this._date.getTime();
	public readonly mtimeMs: number = this._options.mtimeMs ?? this._date.getTime();
	public readonly ctimeMs: number = this._options.ctimeMs ?? this._date.getTime();
	public readonly birthtimeMs: number = this._options.birthtimeMs ?? this._date.getTime();
	public readonly atime: Date = this._options.atime ?? this._date;
	public readonly mtime: Date = this._options.mtime ?? this._date;
	public readonly ctime: Date = this._options.ctime ?? this._date;
	public readonly birthtime: Date = this._options.birthtime ?? this._date;

	constructor(private readonly _options: PrepareOptionsFromClass<fs.Stats> = {}) { }

	public isFile(): boolean {
		return this._options.isFile ?? true;
	}

	public isDirectory(): boolean {
		return this._options.isDirectory ?? false;
	}

	public isBlockDevice(): boolean {
		return this._options.isBlockDevice ?? false;
	}

	public isCharacterDevice(): boolean {
		return this._options.isCharacterDevice ?? false;
	}

	public isSymbolicLink(): boolean {
		return this._options.isSymbolicLink ?? false;
	}

	public isFIFO(): boolean {
		return this._options.isFIFO ?? false;
	}

	public isSocket(): boolean {
		return this._options.isSocket ?? false;
	}
}
