const path = require('path');

const current = require('@nodelib/fs.walk');

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

let walk;

if (suite === 'current') {
	walk = current.walkSync;
}

if (suite === 'next') {
	walk = next.walkSync;
}

if (walk === undefined) {
	throw new Error(`Unknown benchmark mode: ${suite}`);
}

console.time('walk');
const entries = walk(CWD, options);
console.timeEnd('walk');

console.log(entries.length);
