import * as fs from 'node:fs';

import type { Dirent } from '../types';

type DirentStatsKeysIntersection = keyof fs.Dirent & keyof fs.Stats;

const kStats = Symbol('stats');

export function createDirentFromStats(name: string, stats: fs.Stats): Dirent {
	return new DirentFromStats(name, stats);
}

// Adapting an internal class in Node.js to mimic the behavior of `fs.Dirent` when creating it manually from `fs.Stats`.
// https://github.com/nodejs/node/blob/a4cf6b204f0b160480153dc293ae748bf15225f9/lib/internal/fs/utils.js#L199C1-L213
export class DirentFromStats extends fs.Dirent {
	private readonly [kStats]: fs.Stats;

	constructor(name: string, stats: fs.Stats) {
		// @ts-expect-error The constructor has parameters, but they are not represented in types.
		// https://github.com/nodejs/node/blob/a4cf6b204f0b160480153dc293ae748bf15225f9/lib/internal/fs/utils.js#L164
		super(name, null);

		this[kStats] = stats;
	}
}

for (const key of Reflect.ownKeys(fs.Dirent.prototype)) {
	const name = key as DirentStatsKeysIntersection;
	const descriptor = Object.getOwnPropertyDescriptor(fs.Dirent.prototype, name);

	if (descriptor?.writable === false || descriptor?.set === undefined) {
		continue;
	}

	DirentFromStats.prototype[name] = function () {
		return this[kStats][name]();
	};
}
