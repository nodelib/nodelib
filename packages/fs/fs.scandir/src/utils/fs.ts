import * as fs from 'fs';

import type { Dirent, Stats } from '../types';

const kStats = Symbol('stats');

type DirentStatsKeysIntersection = keyof Dirent & keyof Stats;

export function createDirentFromStats(name: string, stats: Stats): Dirent {
	return new DirentFromStats(name, stats);
}

/**
 * Adapting an internal class from Node.js.
 * https://github.com/nodejs/node/blob/8e42eaec53e7fc70c90c4aaebaf672e89c598afe/lib/internal/fs/utils.js#L193-L207
 *
 * We use it to mimic built-in types and provide continuity with the 'fs.Dirent' class.
 * https://github.com/nodejs/node/blob/8e42eaec53e7fc70c90c4aaebaf672e89c598afe/lib/internal/fs/utils.js#L265
 */
class DirentFromStats extends fs.Dirent {
	private readonly [kStats]: Stats;

	constructor(name: string, stats: Stats) {
		// @ts-expect-error Awaiting type correction. The constructor has arguments.
		// https://github.com/nodejs/node/blob/8e42eaec53e7fc70c90c4aaebaf672e89c598afe/lib/internal/fs/utils.js#L158
		super(name, null);

		this[kStats] = stats;
	}
}

for (const key of Reflect.ownKeys(fs.Dirent.prototype)) {
	const name = key as DirentStatsKeysIntersection | 'constructor';

	if (name === 'constructor') {
		continue;
	}

	DirentFromStats.prototype[name] = function () {
		return this[kStats][name]();
	};
}
