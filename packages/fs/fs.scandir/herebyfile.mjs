import * as path from 'node:path';
import * as fs from 'node:fs/promises';

import { execa } from 'execa';
import { task } from 'hereby';
import { rimraf } from 'rimraf';

const FIXTURES_DIRECTORY_PATH = 'fixtures';
const REGRESSION_SYNC_SUITE = './out/benchmark/suites/sync.js';
const REGRESSION_ASYNC_SUITE = './out/benchmark/suites/async.js';

const REPORTER = process.env.REPORTER ?? 'compact';
const WARMUP_COUNT = process.env.WARMUP_COUNT ?? 50;
const RUNS_COUNT = process.env.RUNS_COUNT ?? 150;
const FIXTURES_COUNT = process.env.FIXTURES_COUNT ?? 30;

/**
 * @typedef {Object} BenchTaskSpec
 * @property {string} label
 * @property {string[]} implementations
 * @property {Object} [options]
 */

async function makeFixtures() {
	const root = FIXTURES_DIRECTORY_PATH;
	const count = FIXTURES_COUNT;

	await rimraf(root);
	await fs.mkdir(root, { recursive: true });

	for (let index = 0; index < count; index++) {
		const filename = `${index}.txt`;
		const filepath = path.join(root, filename);

		// eslint-disable-next-line no-await-in-loop
		await fs.writeFile(filepath, `file: ${index}`);
		// eslint-disable-next-line no-await-in-loop
		await fs.symlink(filename, `${filepath}.symlink`, 'junction');
		// eslint-disable-next-line no-await-in-loop
		await fs.mkdir(path.join(root, `directory-${index}`), { recursive: true });
	}

	await fs.symlink('unknown', path.join(root, 'broken.symlink'));
}

/**
 * @param {string} suite
 * @param {BenchTaskSpec} spec
 */
async function benchTask(suite, spec) {
	const root = FIXTURES_DIRECTORY_PATH;
	const label = spec.label;
	const implementations = spec.implementations;
	const options = spec.options ?? {};

	await execa('bencho', [
		`'node ${suite} {impl} ${root}'`,
		`-n "${label} {impl} ${root}"`,
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

function makeBenchSuiteTask(type, suite, implementations = []) {
	const fixturesTask = task({
		name: `bench:${type}:fixtures`,
		run: () => makeFixtures(),
	});

	const defaultTask = task({
		name: `bench:${type}:default`,
		dependencies: [fixturesTask],
		run: () => benchTask(suite, {
			label: 'sync',
			implementations,
		}),
	});

	const statsTask = task({
		name: `bench:${type}:stats`,
		dependencies: [defaultTask],
		run: () => benchTask(suite, {
			label: 'sync',
			implementations,
			options: { stats: true },
		}),
	});

	const followSymbolicLinksTask = task({
		name: `bench:${type}:followSymbolicLinks`,
		dependencies: [statsTask],
		run: () => benchTask(suite, {
			label: 'sync',
			implementations,
			options: { followSymbolicLinks: true, throwErrorOnBrokenSymbolicLink: false },
		}),
	});

	return task({
		name: `bench:${type}`,
		dependencies: [followSymbolicLinksTask],
		run: () => {},
	});
}

export const {
	syncTask,
	asyncTask,
} = {
	syncTask: makeBenchSuiteTask('sync', REGRESSION_SYNC_SUITE, ['current', 'previous']),
	asyncTask: makeBenchSuiteTask('async', REGRESSION_ASYNC_SUITE, ['current', 'previous']),
};
