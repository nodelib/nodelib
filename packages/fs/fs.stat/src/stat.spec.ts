import * as assert from 'node:assert';
import * as fs from 'node:fs';

import * as rimraf from 'rimraf';
import { after, before, describe, it } from 'mocha';

import { stat, statSync } from './stat';
import { stat as statPromise } from './stat-promises';
import { Settings } from './settings';

describe('Stat', () => {
	before(() => {
		rimraf.sync('fixtures');

		fs.mkdirSync('fixtures');
		fs.mkdirSync('fixtures/a');
		fs.symlinkSync('a', 'fixtures/b', 'junction');
	});

	after(() => {
		rimraf.sync('fixtures');
	});

	describe('.stat (promise)', () => {
		it('should work without options or settings', async () => {
			const stats = await statPromise('fixtures/b');

			assert.ok(stats instanceof fs.Stats);
		});

		it('should work with options', async () => {
			const stats = await statPromise('fixtures/b', { markSymbolicLink: true });

			assert.strictEqual(stats.isSymbolicLink(), true);
		});

		it('should work with settings', async () => {
			const settings = new Settings({ markSymbolicLink: true });

			const stats = await statPromise('fixtures/b', settings);

			assert.strictEqual(stats.isSymbolicLink(), true);
		});
	});

	describe('.stat', () => {
		it('should work without options or settings', (done) => {
			stat('fixtures/b', (error, stats) => {
				assert.strictEqual(error, null);
				assert.ok(stats instanceof fs.Stats);
				done();
			});
		});

		it('should work with options', (done) => {
			stat('fixtures/b', { markSymbolicLink: true }, (error, stats) => {
				assert.strictEqual(error, null);
				assert.strictEqual(stats.isSymbolicLink(), true);
				done();
			});
		});

		it('should work with settings', (done) => {
			const settings = new Settings({ markSymbolicLink: true });

			stat('fixtures/b', settings, (error, stats) => {
				assert.strictEqual(error, null);
				assert.strictEqual(stats.isSymbolicLink(), true);
				done();
			});
		});
	});

	describe('.statSync', () => {
		it('should work without options or settings', () => {
			const actual = statSync('fixtures/b');

			assert.ok(actual instanceof fs.Stats);
		});

		it('should work with options', () => {
			const actual = statSync('fixtures/b', { markSymbolicLink: true });

			assert.strictEqual(actual.isSymbolicLink(), true);
		});

		it('should work with settings', () => {
			const settings = new Settings({ markSymbolicLink: true });

			const actual = statSync('fixtures/b', settings);

			assert.strictEqual(actual.isSymbolicLink(), true);
		});
	});
});
