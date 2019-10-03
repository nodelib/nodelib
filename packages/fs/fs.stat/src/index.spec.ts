import * as assert from 'assert';
import * as fs from 'fs';

import * as rimraf from 'rimraf';

import * as pkg from '.';

describe('Package', () => {
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
		it('should work without options or settings', (done) => {
			pkg.stat('fixtures/b', (error, stats) => {
				assert.strictEqual(error, null);
				assert.ok(stats);
				done();
			});
		});

		it('should work with options', (done) => {
			pkg.stat('fixtures/b', { markSymbolicLink: true }, (error, stats) => {
				assert.strictEqual(error, null);
				assert.strictEqual(stats.isSymbolicLink(), true);
				done();
			});
		});

		it('should work with settings', (done) => {
			const settings = new pkg.Settings({ markSymbolicLink: true });

			pkg.stat('fixtures/b', settings, (error, stats) => {
				assert.strictEqual(error, null);
				assert.strictEqual(stats.isSymbolicLink(), true);
				done();
			});
		});
	});

	describe('.statSync', () => {
		it('should work without options or settings', () => {
			const actual = pkg.statSync('fixtures/b');

			assert.ok(actual);
		});

		it('should work with options', () => {
			const actual = pkg.statSync('fixtures/b', { markSymbolicLink: true });

			assert.strictEqual(actual.isSymbolicLink(), true);
		});

		it('should work with settings', () => {
			const settings = new pkg.Settings({ markSymbolicLink: true });

			const actual = pkg.statSync('fixtures/b', settings);

			assert.strictEqual(actual.isSymbolicLink(), true);
		});
	});
});
