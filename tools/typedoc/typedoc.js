#!/usr/bin/env node

const path = require('path');

const { CliApplication } = require('typedoc');

const LERNA_ROOT_PATH = process.env.LERNA_ROOT_PATH;
const LERNA_PACKAGE_NAME = process.env.LERNA_PACKAGE_NAME;

const PACKAGE_TSCONFIG_PATH = path.join(process.cwd(), 'tsconfig.json');
const DOCS_PATH = path.join(LERNA_ROOT_PATH, 'docs', LERNA_PACKAGE_NAME);

const app = new CliApplication({
	tsconfig: PACKAGE_TSCONFIG_PATH,
	out: DOCS_PATH,
	mode: 'file',
	exclude: ['**/*.spec.ts'],
	plugin: ['typedoc-plugin-example-tag'],
	excludePrivate: true
});
