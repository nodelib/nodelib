const { Suite } = require('benchmark');

const fsScandirPrevious = require('@nodelib/fs.scandir-previous');
const fsScandirCurrent = require('../../..');

const BENCHMARK_CWD = process.env.BENCHMARK_CWD || process.cwd();

const stats = {
	count: { current: 0, previous: 0 },
};

/** @type {import('benchmark').Options} */
const options = {
	defer: true,
	initCount: 100,
	maxTime: 120,
	minSamples: 5000,
};

const suite = new Suite('fs.scandir.async');

suite
	.add('current', {
		...options,
		fn: (deferred) => {
			fsScandirCurrent.scandir(BENCHMARK_CWD, (_error, entries) => {
				stats.count.current = entries.length;
				deferred.resolve();
			});
		},
	})
	.add('previous', {
		...options,
		fn: (deferred) => {
			fsScandirPrevious.scandir(BENCHMARK_CWD, (_error, entries) => {
				stats.count.previous = entries.length;
				deferred.resolve();
			});
		},
	})
	.on('cycle', (event) => {
		console.log(`${event.target} [${stats.count[event.target.name]} entries]`);
	})
	.run();
