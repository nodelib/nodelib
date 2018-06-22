import * as fs from 'fs';

export function getFakeStats(): fs.Stats {
	return {
		ino: 0,
		isFile: () => true,
		isDirectory: () => false,
		isSymbolicLink: () => false
	} as fs.Stats;
}
