import * as fs from 'node:fs';

// https://github.com/nodejs/node/blob/6675505686310771b8016805a381945826aad887/typings/internalBinding/constants.d.ts#L139-L146
export enum DirentType {
	Unknown = 0,
	File = 1,
	Directory = 2,
	Link = 3,
	Fifo = 4,
	Socket = 5,
	Char = 6,
	Block = 7,
}

export class Dirent extends fs.Dirent {
	constructor(name: string = 'unknown.txt', type: DirentType = DirentType.Unknown) {
		// @ts-expect-error Types do not provide arguments.
		// https://github.com/nodejs/node/blob/6675505686310771b8016805a381945826aad887/lib/internal/fs/utils.js#L164
		super(name, type);
	}
}
