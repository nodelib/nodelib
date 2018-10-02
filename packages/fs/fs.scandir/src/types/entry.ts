import * as fs from 'fs';

export interface DirEntry {
	name: string;
	path: string;
	ino: number;
	isFile: boolean;
	isDirectory: boolean;
	isSymlink: boolean;
	stats?: fs.Stats;
}
