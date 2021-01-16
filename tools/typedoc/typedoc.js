#!/usr/bin/env node

const path = require('path');

const { Application, TSConfigReader, TypeDocReader } = require('typedoc');

const LERNA_ROOT_PATH = process.env.LERNA_ROOT_PATH;
const LERNA_PACKAGE_NAME = process.env.LERNA_PACKAGE_NAME;

const PACKAGE_TSCONFIG_PATH = path.join(process.cwd(), 'tsconfig.json');
const DOCS_PATH = path.join(LERNA_ROOT_PATH, 'docs', LERNA_PACKAGE_NAME);

async function main() {
	const app = new Application();

	app.options.addReader(new TSConfigReader());
	app.options.addReader(new TypeDocReader());

	app.bootstrap({
		tsconfig: PACKAGE_TSCONFIG_PATH,
		entryPoints: [
			'./src/index.ts'
		],
		exclude: [
			'**/tests/**',
			'**/*.spec.ts'
		],
		plugin: ['typedoc-plugin-example-tag']
	});

	const project = app.convert();

	if (project) {
		await app.generateDocs(project, DOCS_PATH);
		await app.generateJson(project, path.join(DOCS_PATH, 'documentation.json'));
	}
}

(async () => {
	try {
		await main();
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
})();
