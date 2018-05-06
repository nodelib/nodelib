import * as assert from 'assert';
import * as fs from 'fs';

import rimraf = require('rimraf');

import * as pkg from './index';

describe('Package', () => {
	before(() => {
		rimraf.sync('fixtures');

		fs.mkdirSync('fixtures');
		fs.mkdirSync('fixtures/a');
		fs.symlinkSync('a', 'fixtures/b');
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
