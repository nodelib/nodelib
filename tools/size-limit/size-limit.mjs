#!/usr/bin/env node

import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import prettyBytes from 'pretty-bytes';
import { Chalk } from 'chalk';

const chalk = new Chalk({ level: 1 });

const executeCommand = promisify(exec);

const RATIO_LIMIT = 10;
const PACKAGE_NAME = process.env.npm_package_name;
const TOOLS_SIZE_LIMIT_SKIP = process.env.TOOLS_SIZE_LIMIT_SKIP;

async function main() {
	const remote = await getPackageSize(`${PACKAGE_NAME}@latest`);
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

		lines.push(`The size of the new version is ${chalk.red(current)} which is ${chalk.yellow(`${sizeRatio.toFixed(2)}%`)} more than the previous version (${chalk.green(previous)}).`);
	}

	if (unpackedSizeRatio > RATIO_LIMIT) {
		const current = prettyBytes(local.unpackedSize);
		const previous = prettyBytes(remote.unpackedSize);

		lines.push(`The unpacked size of the new version is ${chalk.red(current)} which is ${chalk.yellow(`${unpackedSizeRatio.toFixed(2)}%`)} more than the previous version (${chalk.green(previous)}).`);
	}

	if (entryCountRatio > RATIO_LIMIT) {
		lines.push(`The number of files in the new version is ${chalk.red(local.entryCount)} which is ${chalk.yellow(`${entryCountRatio.toFixed(2)}%`)} more than the previous version (${chalk.green(remote.entryCount)}).`);
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
 * @param {string} name
 * @returns {Promise<PackageInfo | null>}
 */
async function getPackageSize(name) {
	try {
		const { stdout } = await executeCommand(`npm pack ${name} --dry --json`);

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
 * @typedef {Object} PackageInfo
 * @property {number} size
 * @property {number} unpackedSize
 * @property {number} entryCount
 */
