import * as fs from 'node:fs';

import type { Dirent } from '../types';

type DirentStatsKeysIntersection = keyof fs.Dirent & keyof fs.Stats;

const kStats = Symbol('stats');

export function createDirentFromStats(name: string, stats: fs.Stats, parentPath: string): Dirent {
	return new DirentFromStats(name, stats, parentPath);
}

// Adapting an internal class in Node.js to mimic the behavior of `fs.Dirent` when creating it manually from `fs.Stats`.
// https://github.com/nodejs/node/blob/e92499c963155fc0accc14ad0a1d10158defa4cb/lib/internal/fs/utils.js#L196-L210
export class DirentFromStats extends fs.Dirent {
	private readonly [kStats]: fs.Stats;

	constructor(name: string, stats: fs.Stats, parentPath: string) {
		// @ts-expect-error The constructor has parameters, but they are not represented in types.
		// https://github.com/nodejs/node/blob/e92499c963155fc0accc14ad0a1d10158defa4cb/lib/internal/fs/utils.js#L197
		super(name, null, parentPath);

		this[kStats] = stats;
	}
}

for (const key of Reflect.ownKeys(fs.Dirent.prototype)) {
	const name = key as 'constructor' | DirentStatsKeysIntersection;

	if (name === 'constructor') {
		continue;
	}

	DirentFromStats.prototype[name] = function () {
		return this[kStats][name]();
	};
}
