import * as fs from 'fs';

import { PrepareOptionsFromClass } from './types';

export default class Dirent implements fs.Dirent {
	public readonly name: string = this._options.name || 'unknown.txt';

	constructor(private readonly _options: PrepareOptionsFromClass<fs.Dirent> = {}) { }

	public isFile(): boolean {
		return ('isFile' in this._options) ? this._options.isFile as boolean : true;
	}

	public isDirectory(): boolean {
		return ('isDirectory' in this._options) ? this._options.isDirectory as boolean : false;
	}

	public isBlockDevice(): boolean {
		return ('isBlockDevice' in this._options) ? this._options.isBlockDevice as boolean : false;
	}

	public isCharacterDevice(): boolean {
		return ('isCharacterDevice' in this._options) ? this._options.isCharacterDevice as boolean : false;
	}

	public isSymbolicLink(): boolean {
		return ('isSymbolicLink' in this._options) ? this._options.isSymbolicLink as boolean : false;
	}

	public isFIFO(): boolean {
		return ('isFIFO' in this._options) ? this._options.isFIFO as boolean : false;
	}

	public isSocket(): boolean {
		return ('isSocket' in this._options) ? this._options.isSocket as boolean : false;
	}
}
