'use strict';

const fs = require('fs');
const path = require('path');

const yargs = require('yargs');

yargs.command('package-new <name>', 'Create a new lerna package structure.', (builder) => {
	builder.positional('name', {
		describe: 'The package name, which must be locally unique',
		type: 'string'
	});
}, command);

/**
 * @typedef CommandArguments
 * @property {string} name
 */

/**
 * @param {CommandArguments} argv
 */
function command({ name }) {
	const fullPackagePath = makeFullPackagePath(name);

	const isExistsPackage = fs.existsSync(fullPackagePath);
	if (isExistsPackage) {
		console.log(`The package with "${name}" name already exists!`);

		process.exit(1);
	}

	fs.mkdirSync(fullPackagePath);

	const fullPackageJsonFilePath = makeFullPackagePath(name, 'package.json');
	fs.writeFileSync(fullPackageJsonFilePath, `{\n  "name": "@nodelib/${name}"\n}`);

	const fullPackageReadmeFilePath = makeFullPackagePath(name, 'README.md');
	fs.writeFileSync(fullPackageReadmeFilePath, `# @nodelib/${name}`);

	const fullPackageNpmRcFilePath = makeFullPackagePath(name, '.npmrc');
	fs.symlinkSync('../../.npmrc', fullPackageNpmRcFilePath);

	const fullPackageNpmIgnorePath = makeFullPackagePath(name, '.npmignore');
	fs.symlinkSync('../../.npmignore', fullPackageNpmIgnorePath);

	const fullPackageLicenseFilePath = makeFullPackagePath(name, 'LICENSE');
	fs.symlinkSync('../../LICENSE', fullPackageLicenseFilePath);

	console.log(`The package with "${name}" name has been created!`);

	process.exit(0);
}

/**
 * @param {string} name
 * @param {string[]} [partials]
 * @returns {string}
 */
function makeFullPackagePath(name, ...partials) {
	return path.resolve('packages', name, ...partials);
}
