const { Suite } = require('benchmark');

const fsScandirPrevious = require('@nodelib/fs.scandir-previous');
const fsScandirCurrent = require('../../..');

const BENCHMARK_CWD = process.env.BENCHMARK_CWD || process.cwd();

const stats = {
	count: { current: 0, previous: 0 },
};

/** @type {import('benchmark').Options} */
const options = {
	initCount: 100,
	maxTime: 120,
	minSamples: 5000,
};

const suite = new Suite('fs.scandir.sync');

suite
	.add('current', {
		...options,
		fn: () => {
			const entries = fsScandirCurrent.scandirSync(BENCHMARK_CWD);

			stats.count.current = entries.length;
		},
	})
	.add('previous', {
		...options,
		fn: () => {
			const entries = fsScandirPrevious.scandirSync(BENCHMARK_CWD);

			stats.count.previous = entries.length;
		},
	})
	.on('cycle', (event) => {
		console.log(`${event.target} [${stats.count[event.target.name]} entries]`);
	})
	.run();
