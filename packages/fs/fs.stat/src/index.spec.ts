import * as assert from 'assert';
import * as fs from 'fs';

import rimraf = require('rimraf');

import * as pkg from './index';

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
		it('should return stat for followed symlink', async () => {
			const actual = await pkg.stat('fixtures/b');

			assert.ok(actual.isDirectory());
			assert.ok(actual.isSymbolicLink());
		});

		it('should return lstat for non-followed symlink', async () => {
			const actual = await pkg.stat('fixtures/b', { followSymlinks: false });

			assert.ok(!actual.isDirectory());
			assert.ok(actual.isSymbolicLink());
		});
	});

	describe('.statCallback', () => {
		it('should throw error when callback is not a function', () => {
			/* tslint:disable-next-line: no-any */
			assert.throws(() => pkg.statCallback('fixtures/b', 'callback' as any), /TypeError: The "callback" argument must be of type Function./);
		});

		it('should return stat for followed symlink', (done) => {
			pkg.statCallback('fixtures/b', (err, stats) => {
				if (err) {
					return done('An unexpected error was found.');
				}

				assert.strictEqual(err, null);
				assert.ok((stats as fs.Stats).isDirectory());
				assert.ok((stats as fs.Stats).isSymbolicLink());
				done();
			});
		});

		it('should return lstat for non-followed symlink', (done) => {
			pkg.statCallback('fixtures/b', { followSymlinks: false }, (err, stats) => {
				if (err) {
					return done('An unexpected error was found.');
				}

				assert.strictEqual(err, null);
				assert.ok(!(stats as fs.Stats).isDirectory());
				assert.ok((stats as fs.Stats).isSymbolicLink());
				done();
			});
		});
	});

	describe('.statSync', () => {
		it('should return stat for followed symlink', () => {
			const actual = pkg.statSync('fixtures/b');

			assert.ok(actual.isDirectory());
			assert.ok(actual.isSymbolicLink());
		});

		it('should return lstat for non-followed symlink', () => {
			const actual = pkg.statSync('fixtures/b', { followSymlinks: false });

			assert.ok(!actual.isDirectory());
			assert.ok(actual.isSymbolicLink());
		});
	});
});
