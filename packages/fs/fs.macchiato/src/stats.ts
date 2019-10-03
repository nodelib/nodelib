import * as fs from 'fs';

import { PrepareOptionsFromClass } from './types';

const uid = process.platform === 'win32' ? undefined : process.getuid();
const gid = process.platform === 'win32' ? undefined : process.getgid();

export default class Stats implements fs.Stats {
	public readonly _date: Date = new Date();

	// eslint-disable-next-line unicorn/prevent-abbreviations
	public readonly dev: number = 'dev' in this._options ? this._options.dev as number : 0;
	public readonly ino: number = 'ino' in this._options ? this._options.ino as number : 0;
	public readonly mode: number = 'mode' in this._options ? this._options.mode as number : 0;
	public readonly nlink: number = 'nlink' in this._options ? this._options.nlink as number : 0;
	public readonly uid: number = 'uid' in this._options ? this._options.uid as number : uid as number;
	public readonly gid: number = 'gid' in this._options ? this._options.gid as number : gid as number;
	public readonly rdev: number = 'rdev' in this._options ? this._options.rdev as number : 0;
	public readonly size: number = 'size' in this._options ? this._options.size as number : 0;
	public readonly blksize: number = 'blksize' in this._options ? this._options.blksize as number : 0;
	public readonly blocks: number = 'blocks' in this._options ? this._options.blocks as number : 0;
	public readonly atimeMs: number = 'atimeMs' in this._options ? this._options.atimeMs as number : this._date.getTime();
	public readonly mtimeMs: number = 'mtimeMs' in this._options ? this._options.mtimeMs as number : this._date.getTime();
	public readonly ctimeMs: number = 'ctimeMs' in this._options ? this._options.ctimeMs as number : this._date.getTime();
	public readonly birthtimeMs: number = 'birthtimeMs' in this._options ? this._options.birthtimeMs as number : this._date.getTime();
	public readonly atime: Date = 'atime' in this._options ? this._options.atime as Date : this._date;
	public readonly mtime: Date = 'mtime' in this._options ? this._options.mtime as Date : this._date;
	public readonly ctime: Date = 'ctime' in this._options ? this._options.ctime as Date : this._date;
	public readonly birthtime: Date = 'birthtime' in this._options ? this._options.birthtime as Date : this._date;

	constructor(private readonly _options: PrepareOptionsFromClass<fs.Stats> = {}) { }

	public isFile(): boolean {
		return 'isFile' in this._options ? this._options.isFile as boolean : true;
	}

	public isDirectory(): boolean {
		return 'isDirectory' in this._options ? this._options.isDirectory as boolean : false;
	}

	public isBlockDevice(): boolean {
		return 'isBlockDevice' in this._options ? this._options.isBlockDevice as boolean : false;
	}

	public isCharacterDevice(): boolean {
		return 'isCharacterDevice' in this._options ? this._options.isCharacterDevice as boolean : false;
	}

	public isSymbolicLink(): boolean {
		return 'isSymbolicLink' in this._options ? this._options.isSymbolicLink as boolean : false;
	}

	public isFIFO(): boolean {
		return 'isFIFO' in this._options ? this._options.isFIFO as boolean : false;
	}

	public isSocket(): boolean {
		return 'isSocket' in this._options ? this._options.isSocket as boolean : false;
	}
}
