import type * as fs from 'fs';

import type { PrepareOptionsFromClass } from './types';

export default class Dirent implements fs.Dirent {
	public readonly name: string = this._options.name ?? 'unknown.txt';

	constructor(private readonly _options: PrepareOptionsFromClass<fs.Dirent> = {}) {}

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
