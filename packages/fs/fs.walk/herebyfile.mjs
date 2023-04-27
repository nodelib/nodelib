import { execa, execaSync } from 'execa';
import { task } from 'hereby';

const REGRESSION_SYNC_SUITE = './out/benchmark/suites/sync.js';
const REGRESSION_ASYNC_SUITE = './out/benchmark/suites/async.js';
const REGRESSION_STREAM_SUITE = './out/benchmark/suites/stream.js';

const REPORTER = process.env.REPORTER ?? 'compact';
const WARMUP_COUNT = Number.parseInt(process.env.WARMUP_COUNT, 10) || 50;
const RUNS_COUNT = Number.parseInt(process.env.RUNS_COUNT, 10) || 150;

function getRepositoryRoot() {
	const cp = execaSync('git', ['rev-parse', '--show-toplevel']);

	return cp.stdout;
}

/**
 * @typedef {Object} BenchTaskSpec
 * @property {string} label
 * @property {string[]} implementations
 * @property {Object} [options]
 */

/**
 * @param {string} suite
 * @param {BenchTaskSpec} spec
 */
async function benchTask(suite, spec) {
	const root = getRepositoryRoot();
	const label = spec.label;
	const implementations = spec.implementations;
	const options = spec.options ?? {};

	await execa('bencho', [
		`'node ${suite} {impl} ${root}'`,
		`-n "${label} {impl} <root>"`,
		`-w ${WARMUP_COUNT}`,
		`-r ${RUNS_COUNT}`,
		`-l impl=${implementations.join(',')}`,
		`--reporter=${REPORTER}`,
	], {
		shell: true,
		stdout: 'inherit',
		env: {
			BENCHMARK_OPTIONS: JSON.stringify(options),
		},
	});
}

function makeBenchSuiteTask(label, suite, implementations = []) {
	const defaultTask = task({
		name: `bench:${label}:default`,
		run: () => benchTask(suite, {
			label,
			implementations,
		}),
	});

	const defaultFilterTask = task({
		name: `bench:${label}:defaultFilter`,
		dependencies: [defaultTask],
		run: () => benchTask(suite, {
			label,
			implementations,
			options: { defaultFilter: true },
		}),
	});

	const depthFilterTask = task({
		name: `bench:${label}:depthFilter`,
		dependencies: [defaultFilterTask],
		run: () => benchTask(suite, {
			label,
			implementations,
			options: { depthFilter: true },
		}),
	});

	const statsTask = task({
		name: `bench:${label}:stats`,
		dependencies: [depthFilterTask],
		run: () => benchTask(suite, {
			label,
			implementations,
			options: { stats: true },
		}),
	});

	const followSymbolicLinksTask = task({
		name: `bench:${label}:followSymbolicLinks`,
		dependencies: [statsTask],
		run: () => benchTask(suite, {
			label,
			implementations,
			options: { followSymbolicLinks: true, throwErrorOnBrokenSymbolicLink: false },
		}),
	});

	return task({
		name: `bench:${label}`,
		dependencies: [followSymbolicLinksTask],
		run: () => {},
	});
}

export const {
	syncTask,
	asyncTask,
	streamTask,
} = {
	syncTask: makeBenchSuiteTask('sync', REGRESSION_SYNC_SUITE, ['current', 'previous']),
	asyncTask: makeBenchSuiteTask('async', REGRESSION_ASYNC_SUITE, ['current', 'previous']),
	streamTask: makeBenchSuiteTask('stream', REGRESSION_STREAM_SUITE, ['current', 'previous']),
};
