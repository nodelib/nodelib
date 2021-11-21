const { Suite } = require('benchmark');

const fsWalkPrevious = require('@nodelib/fs.walk-previous');
const fsWalkCurrent = require('../../..');

const BENCHMARK_CWD = process.env.BENCHMARK_CWD || process.cwd();

const stats = {
	count: { current: 0, previous: 0 },
};

/** @type {import('benchmark').Options} */
const options = {
	initCount: 100,
	maxTime: 120,
	minSamples: 100,
};

const suite = new Suite('fs.walk.sync');

suite
	.add('current', {
		...options,
		fn: () => {
			const entries = fsWalkCurrent.walkSync(BENCHMARK_CWD);

			stats.count.current = entries.length;
		},
	})
	.add('previous', {
		...options,
		fn: () => {
			const entries = fsWalkPrevious.walkSync(BENCHMARK_CWD);

			stats.count.previous = entries.length;
		},
	})
	.on('cycle', (event) => {
		console.log(`${event.target} [${stats.count[event.target.name]} entries]`);
	})
	.run();
