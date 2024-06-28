import * as assert from 'node:assert';
import * as fs from 'node:fs';

import * as rimraf from 'rimraf';

import { stat, statSync } from './stat';
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

	describe('.stat', () => {
		it('should work without options or settings', async () => {
			const stats = await stat('fixtures/b');
			assert.ok(stats);
		});

		it('should work with options', async () => {
			const stats = await stat('fixtures/b', { markSymbolicLink: true });
			assert.strictEqual(stats.isSymbolicLink(), true);
		});

		it('should work with settings', async () => {
			const settings = new Settings({ markSymbolicLink: true });

			const stats = await stat('fixtures/b', settings);
			assert.strictEqual(stats.isSymbolicLink(), true);
		});
	});

	describe('.statSync', () => {
		it('should work without options or settings', () => {
			const actual = statSync('fixtures/b');

			assert.ok(actual);
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
