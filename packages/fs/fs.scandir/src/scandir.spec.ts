import * as assert from 'node:assert';
import * as fs from 'node:fs';

import * as rimraf from 'rimraf';

import { scandir, scandirSync } from './scandir';
import { Settings } from './settings';

describe('Scandir', () => {
	before(() => {
		rimraf.sync('fixtures');

		fs.mkdirSync('fixtures');
		fs.writeFileSync('fixtures/file.txt', '');
	});

	after(() => {
		rimraf.sync('fixtures');
	});

	describe('.scandir', () => {
		it('should work without options or settings', async () => {
			const entries = await scandir('fixtures');
			assert.ok(entries[0]?.name);
			assert.ok(entries[0]?.path);
			assert.ok(entries[0]?.dirent);
		});

		it('should work with options', async () => {
			const entries = await scandir('fixtures', { stats: true });
			assert.ok(entries[0]?.name);
			assert.ok(entries[0]?.path);
			assert.ok(entries[0]?.dirent);
			assert.ok(entries[0]?.stats);
		});

		it('should work with settings', async () => {
			const settings = new Settings({ stats: true });

			const entries = await scandir('fixtures', settings);

			assert.ok(entries[0]?.name);
			assert.ok(entries[0]?.path);
			assert.ok(entries[0]?.dirent);
			assert.ok(entries[0]?.stats);
		});
	});

	describe('.scandirSync', () => {
		it('should work without options or settings', () => {
			const actual = scandirSync('fixtures');

			assert.ok(actual[0]?.name);
			assert.ok(actual[0]?.path);
			assert.ok(actual[0]?.dirent);
		});

		it('should work with options', () => {
			const actual = scandirSync('fixtures', { stats: true });

			assert.ok(actual[0]?.name);
			assert.ok(actual[0]?.path);
			assert.ok(actual[0]?.dirent);
			assert.ok(actual[0]?.stats);
		});

		it('should work with settings', () => {
			const settings = new Settings({ stats: true });

			const actual = scandirSync('fixtures', settings);

			assert.ok(actual[0]?.name);
			assert.ok(actual[0]?.path);
			assert.ok(actual[0]?.dirent);
			assert.ok(actual[0]?.stats);
		});
	});
});
