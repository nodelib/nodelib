import * as assert from 'node:assert';
import * as fs from 'node:fs';
import {
	after,
	before,
	describe,
	it,
	type TestContext,
} from 'node:test';
import { scandir, scandirSync } from './scandir.js';
import { scandir as scandirPromise } from './scandir-promises.js';
import { Settings } from './settings.js';

describe('Scandir', () => {
	before(() => {
		fs.rmSync('fixtures', { recursive: true, force: true });

		fs.mkdirSync('fixtures');
		fs.writeFileSync('fixtures/file.txt', '');
	});

	after(() => {
		fs.rmSync('fixtures', { recursive: true, force: true });
	});

	describe('.scandir (promise)', () => {
		it('should work without options or settings', async () => {
			const entries = await scandirPromise('fixtures');

			assert.notStrictEqual(entries[0]?.name, undefined);
			assert.notStrictEqual(entries[0]?.path, undefined);
			assert.ok(entries[0]?.dirent instanceof fs.Dirent);
		});

		it('should work with options', async () => {
			const entries = await scandirPromise('fixtures', { stats: true });

			assert.notStrictEqual(entries[0]?.name, undefined);
			assert.notStrictEqual(entries[0]?.path, undefined);
			assert.ok(entries[0]?.dirent instanceof fs.Dirent);
			assert.ok(entries[0]?.stats);
		});

		it('should work with settings', async () => {
			const settings = new Settings({ stats: true });

			const entries = await scandirPromise('fixtures', settings);

			assert.notStrictEqual(entries[0]?.name, undefined);
			assert.notStrictEqual(entries[0]?.path, undefined);
			assert.ok(entries[0]?.dirent instanceof fs.Dirent);
			assert.ok(entries[0]?.stats);
		});
	});

	describe('.scandir', () => {
		it('should work without options or settings', (t: TestContext, done) => {
			scandir('fixtures', (error, entries) => {
				t.assert.strictEqual(error, null);
				t.assert.notStrictEqual(entries[0]?.name, undefined);
				t.assert.notStrictEqual(entries[0]?.path, undefined);
				t.assert.ok(entries[0]?.dirent instanceof fs.Dirent);
				done();
			});
		});

		it('should work with options', (t: TestContext, done) => {
			scandir('fixtures', { stats: true }, (error, entries) => {
				t.assert.strictEqual(error, null);
				t.assert.notStrictEqual(entries[0]?.name, undefined);
				t.assert.notStrictEqual(entries[0]?.path, undefined);
				t.assert.ok(entries[0]?.dirent instanceof fs.Dirent);
				t.assert.ok(entries[0]?.stats);
				done();
			});
		});

		it('should work with settings', (t: TestContext, done) => {
			const settings = new Settings({ stats: true });

			scandir('fixtures', settings, (error, entries) => {
				t.assert.strictEqual(error, null);
				t.assert.notStrictEqual(entries[0]?.name, undefined);
				t.assert.notStrictEqual(entries[0]?.path, undefined);
				t.assert.ok(entries[0]?.dirent instanceof fs.Dirent);
				t.assert.ok(entries[0]?.stats);
				done();
			});
		});
	});

	describe('.scandirSync', () => {
		it('should work without options or settings', () => {
			const actual = scandirSync('fixtures');

			assert.notStrictEqual(actual[0]?.name, undefined);
			assert.notStrictEqual(actual[0]?.path, undefined);
			assert.ok(actual[0]?.dirent instanceof fs.Dirent);
		});

		it('should work with options', () => {
			const actual = scandirSync('fixtures', { stats: true });

			assert.notStrictEqual(actual[0]?.name, undefined);
			assert.notStrictEqual(actual[0]?.path, undefined);
			assert.ok(actual[0]?.dirent instanceof fs.Dirent);
			assert.ok(actual[0]?.stats);
		});

		it('should work with settings', () => {
			const settings = new Settings({ stats: true });

			const actual = scandirSync('fixtures', settings);

			assert.notStrictEqual(actual[0]?.name, undefined);
			assert.notStrictEqual(actual[0]?.path, undefined);
			assert.ok(actual[0]?.dirent instanceof fs.Dirent);
			assert.ok(actual[0]?.stats);
		});
	});
});
