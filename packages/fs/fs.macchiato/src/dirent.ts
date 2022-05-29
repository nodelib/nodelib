import * as fs from 'fs';

import type { PrepareOptionsFromClass } from './types';

type DirentOptions = PrepareOptionsFromClass<fs.Dirent>;

export default class Dirent extends fs.Dirent {
	public override readonly name: string = this._options.name ?? 'unknown.txt';

	constructor(private readonly _options: DirentOptions = {}) {
		super();
	}

	public override isFile(): boolean {
		return this._options.isFile ?? false;
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
