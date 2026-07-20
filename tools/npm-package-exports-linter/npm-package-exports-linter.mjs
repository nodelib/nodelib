#!/usr/bin/env node

import { exec } from 'node:child_process';
import path from 'node:path';
import * as process from 'node:process';
import { promisify } from 'node:util';
import chalk from 'chalk';

const { LERNA_PACKAGE_NAME } = process.env;

chalk.level = 1;
const executeCommand = promisify(exec);

async function main() {
	const packageFiles = await getPackageFiles(LERNA_PACKAGE_NAME);
	const packageManifestExportFiles = await getPackageManifestExportFiles(LERNA_PACKAGE_NAME);

	assertManifestExportFilesByPackageFiles(packageManifestExportFiles, packageFiles);
}

/**
 * Gets files included in a package published to npm.
 *
 * @param {string} name - Package name or path.
 * @returns {Promise<string[]>} Paths of the files included in the package.
 */
async function getPackageFiles(name) {
	const { stdout } = await executeCommand(`npm pack ${name} --dry --json`);

	/** @type {[PackageInfo]} */
	const [data] = JSON.parse(stdout);

	return data.files.map((it) => path.normalize(it.path));
}

/**
 * Gets files referenced by the package export map.
 *
 * @param {string} name - Identifier used to select a manifest from npm's output.
 * @returns {Promise<string[]>} Paths referenced by the export map.
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
 * Ensures every exported file is included in the published package.
 *
 * @param {string[]} manifestExportFiles - Paths referenced by the export map.
 * @param {string[]} packageFiles - Paths included in the package.
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
 * Metadata reported by npm for a package.
 *
 * @typedef {object} PackageInfo
 * @property {Record<string, Record<string, string>>} exports - Package export map.
 * @property {PackageFile[]} files - Files included in the package.
 */

/**
 * File included in a package.
 *
 * @typedef {object} PackageFile
 * @property {string} path - Relative path inside the package.
 */
