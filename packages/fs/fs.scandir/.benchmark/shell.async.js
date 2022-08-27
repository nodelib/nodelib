const fs = require('fs');
const path = require('path');

const current = require('@nodelib/fs.scandir');

const next = require('..');

const CWD = process.env.BENCHMARK_CWD || path.join(process.cwd(), '..', '..', '..');
const OPTIONS_STATS = process.env.BENCHMARK_STATS;
const OPTIONS_FSL = process.env.BENCHMARK_FSL;

const args = process.argv.slice(2);
const isShell = args[0] === '-c';
const suite = args[1];

if (isShell && suite === '') {
	process.exit(0);
}

const options = {
	stats: OPTIONS_STATS === '1',
	followSymbolicLinks: OPTIONS_FSL === '1'
};

let scandir;

if (suite === 'readdir') {
	scandir = (directory, _options, callback) => fs.readdir(directory, { withFileTypes: true }, callback);
}

if (suite === 'current') {
	scandir = current.scandir;
}

if (suite === 'next') {
	scandir = next.scandir;
}

if (scandir === undefined) {
	throw new Error(`Unknown benchmark mode: ${suite}`);
}

console.time('scandir');

scandir(CWD, options, (error, entries) => {
	if (error !== null) {
		throw error;
	}

	console.timeEnd('scandir');

	console.log(entries.length);
});
