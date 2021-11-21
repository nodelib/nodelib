const { Suite } = require('benchmark');

const fsWalkPrevious = require('@nodelib/fs.walk-previous');
const fsWalkCurrent = require('../../..');

const BENCHMARK_CWD = process.env.BENCHMARK_CWD || process.cwd();

const stats = {
	count: { current: 0, previous: 0 },
};

/** @type {import('benchmark').Options} */
const options = {
	defer: true,
	initCount: 100,
	maxTime: 120,
	minSamples: 100,
};

const suite = new Suite('fs.walk.stream');

suite
	.add('current', {
		...options,
		fn: (deferred) => {
			const stream = fsWalkCurrent.walkStream(BENCHMARK_CWD);

			stream.on('entry', () => {
				stats.count.current++;
			});

			stream.once('end', () => {
				deferred.resolve();
			});
		},
	})
	.add('previous', {
		...options,
		fn: (deferred) => {
			const stream = fsWalkPrevious.walkStream(BENCHMARK_CWD);

			stream.on('entry', () => {
				stats.count.previous++;
			});

			stream.once('end', () => {
				deferred.resolve();
			});
		},
	})
	.on('cycle', (event) => {
		console.log(`${event.target} [${stats.count[event.target.name]} entries]`);
	})
	.run();
