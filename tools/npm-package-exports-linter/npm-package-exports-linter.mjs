#!/usr/bin/env node

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import * as path from 'node:path';

import { Chalk } from 'chalk';

const LERNA_PACKAGE_NAME = process.env.LERNA_PACKAGE_NAME;

const chalk = new Chalk({ level: 1 });
const executeCommand = promisify(exec);

async function main() {
	const packageFiles = await getPackageFiles(LERNA_PACKAGE_NAME);
	const packageManifestExportFiles = await getPackageManifestExportFiles(LERNA_PACKAGE_NAME);

	assertManifestExportFilesByPackageFiles(packageManifestExportFiles, packageFiles);
}

/**
 * @param {string} name
 * @returns {Promise<string[]>}
 */
async function getPackageFiles(name) {
	const { stdout } = await executeCommand(`npm pack ${name} --dry --json`);

	/** @type {[PackageInfo]} */
	const [data] = JSON.parse(stdout);

	return data.files.map((it) => path.normalize(it.path));
}

/**
 * @param {string} name
 * @returns {Promise<string>}
 */
async function getPackageManifestExportFiles(name) {
	const { stdout } = await executeCommand('npm pkg get exports --json');

	/** @type {Record<string, PackageInfo>} */
	const manifests = JSON.parse(stdout);

	const exportBlocks = Object.values(manifests[name] || {});
	const exportEntries = exportBlocks.map((it) => Object.values(it));
	const exportFiles = exportEntries.flat();

	return exportFiles.map((it) => path.normalize(it));
}

/**
 * @param {string[]} manifestExportFiles
 * @param {string[]} packageFiles
 */
function assertManifestExportFilesByPackageFiles(manifestExportFiles, packageFiles) {
	const index = new Set(packageFiles);

	const missingFiles = manifestExportFiles.filter((it) => !index.has(it));

	if (missingFiles.length > 0) {
		throw new Error(`Missing export files in package: ${missingFiles.join(', ')}`);
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
 * @property {Record<string, Record<string, string>>} exports
 * @property {PackageFile[]} files
 */

/**
 * @typedef {Object} PackageFile
 * @property {string} path
 */
