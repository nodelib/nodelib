import * as assert from 'node:assert';
import * as fs from 'node:fs';

import * as rimraf from 'rimraf';
import { after, before, describe, it } from 'mocha';

import { scandir, scandirSync } from './scandir';
import { scandir as scandirPromise } from './scandir-promises';
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

	describe('.scandir (promise)', () => {
		it('should work without options or settings', async () => {
			const entries = await scandirPromise('fixtures');

			assert.ok(entries[0]?.name !== undefined);
			assert.ok(entries[0]?.path);
			assert.ok(entries[0]?.dirent instanceof fs.Dirent);
		});

		it('should work with options', async () => {
			const entries = await scandirPromise('fixtures', { stats: true });

			assert.ok(entries[0]?.name !== undefined);
			assert.ok(entries[0]?.path);
			assert.ok(entries[0]?.dirent instanceof fs.Dirent);
			assert.ok(entries[0]?.stats);
		});

		it('should work with settings', async () => {
			const settings = new Settings({ stats: true });

			const entries = await scandirPromise('fixtures', settings);

			assert.ok(entries[0]?.name !== undefined);
			assert.ok(entries[0]?.path);
			assert.ok(entries[0]?.dirent instanceof fs.Dirent);
			assert.ok(entries[0]?.stats);
		});
	});

	describe('.scandir', () => {
		it('should work without options or settings', (done) => {
			scandir('fixtures', (error, entries) => {
				assert.strictEqual(error, null);
				assert.ok(entries[0]?.name !== undefined);
				assert.ok(entries[0]?.path);
				assert.ok(entries[0]?.dirent instanceof fs.Dirent);
				done();
			});
		});

		it('should work with options', (done) => {
			scandir('fixtures', { stats: true }, (error, entries) => {
				assert.strictEqual(error, null);
				assert.ok(entries[0]?.name !== undefined);
				assert.ok(entries[0]?.path);
				assert.ok(entries[0]?.dirent instanceof fs.Dirent);
				assert.ok(entries[0]?.stats);
				done();
			});
		});

		it('should work with settings', (done) => {
			const settings = new Settings({ stats: true });

			scandir('fixtures', settings, (error, entries) => {
				assert.strictEqual(error, null);
				assert.ok(entries[0]?.name !== undefined);
				assert.ok(entries[0]?.path);
				assert.ok(entries[0]?.dirent instanceof fs.Dirent);
				assert.ok(entries[0]?.stats);
				done();
			});
		});
	});

	describe('.scandirSync', () => {
		it('should work without options or settings', () => {
			const actual = scandirSync('fixtures');

			assert.ok(actual[0]?.name !== undefined);
			assert.ok(actual[0]?.path);
			assert.ok(actual[0]?.dirent instanceof fs.Dirent);
		});

		it('should work with options', () => {
			const actual = scandirSync('fixtures', { stats: true });

			assert.ok(actual[0]?.name !== undefined);
			assert.ok(actual[0]?.path);
			assert.ok(actual[0]?.dirent instanceof fs.Dirent);
			assert.ok(actual[0]?.stats);
		});

		it('should work with settings', () => {
			const settings = new Settings({ stats: true });

			const actual = scandirSync('fixtures', settings);

			assert.ok(actual[0]?.name !== undefined);
			assert.ok(actual[0]?.path);
			assert.ok(actual[0]?.dirent instanceof fs.Dirent);
			assert.ok(actual[0]?.stats);
		});
	});
});
