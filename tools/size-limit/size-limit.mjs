#!/usr/bin/env node

import * as process from 'node:process';
import chalk from 'chalk';
import { execa } from 'execa';
import prettyBytes from 'pretty-bytes';

chalk.level = 1;

const RATIO_LIMIT = 10;
const { LERNA_PACKAGE_NAME, TOOLS_SIZE_LIMIT_SKIP } = process.env;

async function main() {
	const remote = await getPackageSize(`${LERNA_PACKAGE_NAME}@latest`);
	const local = await getPackageSize('.');

	if (remote === null) {
		return;
	}

	// How much the current value is greater than the previous one.
	const sizeRatio = (local.size - remote.size) / remote.size * 100;
	const unpackedSizeRatio = (local.unpackedSize - remote.unpackedSize) / remote.unpackedSize * 100;
	const entryCountRatio = (local.entryCount - remote.entryCount) / remote.entryCount * 100;

	/** @type {string[]} */
	const lines = [];

	if (sizeRatio > RATIO_LIMIT) {
		const current = prettyBytes(local.size);
		const previous = prettyBytes(remote.size);
		const difference = chalk.yellow(`${sizeRatio.toFixed(2)}%`);
		const message = `The size of the new version is ${chalk.red(current)} which is ${difference} more than the previous version (${chalk.green(previous)}).`;

		lines.push(message);
	}

	if (unpackedSizeRatio > RATIO_LIMIT) {
		const current = prettyBytes(local.unpackedSize);
		const previous = prettyBytes(remote.unpackedSize);
		const difference = chalk.yellow(`${unpackedSizeRatio.toFixed(2)}%`);
		const message = `The unpacked size of the new version is ${chalk.red(current)} which is ${difference} more than the previous version (${chalk.green(previous)}).`;

		lines.push(message);
	}

	if (entryCountRatio > RATIO_LIMIT) {
		const difference = chalk.yellow(`${entryCountRatio.toFixed(2)}%`);
		const message = `The number of files in the new version is ${chalk.red(local.entryCount)} which is ${difference} more than the previous version (${chalk.green(remote.entryCount)}).`;

		lines.push(message);
	}

	if (lines.length > 0) {
		console.log(lines.join('\n'));

		if (TOOLS_SIZE_LIMIT_SKIP) {
			console.log('The size limit is reached, but the checker is disabled.');
		} else {
			throw new Error('The size limit is reached.');
		}
	}
}

/**
 * Gets size details for a package published to npm.
 *
 * @param {string} name - Package name or path.
 * @returns {Promise<PackageInfo | null>} Package details, or null if the package is unpublished.
 */
async function getPackageSize(name) {
	try {
		const { stdout } = await execa('npm', ['pack', name, '--dry-run', '--json']);

		const data = JSON.parse(stdout);

		return {
			size: data[0].size,
			unpackedSize: data[0].unpackedSize,
			entryCount: data[0].entryCount,
		};
	} catch (error) {
		if (error.stderr.includes('E404')) {
			return null;
		}

		throw error;
	}
}

(async () => {
	try {
		await main();
		console.log(chalk.green('success'));
	} catch (error) {
		console.log(chalk.red(error.message));
		process.exit(1);
	}
})();

/**
 * Package size details reported by npm.
 *
 * @typedef {object} PackageInfo
 * @property {number} size - Packed size in bytes.
 * @property {number} unpackedSize - Unpacked size in bytes.
 * @property {number} entryCount - Number of files in the package.
 */
