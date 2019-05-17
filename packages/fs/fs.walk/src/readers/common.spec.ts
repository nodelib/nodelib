import * as assert from 'assert';
import * as path from 'path';

import Settings from '../settings';
import * as tests from '../tests/index';
import * as common from './common';

describe('Readers → Common', () => {
	describe('.isFatalError', () => {
		it('should return true when filter is not defined', () => {
			const settings = new Settings();

			const actual = common.isFatalError(settings, tests.EPERM_ERRNO);

			assert.ok(actual);
		});

		it('should return true when the error cannot be suppressed', () => {
			const settings = new Settings({
				errorFilter: (error) => error.code === 'ENOENT'
			});

			const actual = common.isFatalError(settings, tests.EPERM_ERRNO);

			assert.ok(actual);
		});

		it('should return false when the error can be suppressed', () => {
			const settings = new Settings({
				errorFilter: (error) => error.code === 'EPERM'
			});

			const actual = common.isFatalError(settings, tests.EPERM_ERRNO);

			assert.ok(!actual);
		});
	});

	describe('.isAppliedFilter', () => {
		it('should return true when the filter is not defined', () => {
			const settings = new Settings();
			const entry = tests.buildFakeFileEntry();

			const actual = common.isAppliedFilter(settings.entryFilter, entry);

			assert.ok(actual);
		});

		it('should return true when the entry will be applied', () => {
			const settings = new Settings({
				entryFilter: (entry) => entry.name === 'fake.txt'
			});
			const fakeEntry = tests.buildFakeFileEntry();

			const actual = common.isAppliedFilter(settings.entryFilter, fakeEntry);

			assert.ok(actual);
		});

		it('should return false when the entry will be skipped', () => {
			const settings = new Settings({
				entryFilter: (entry) => entry.name !== 'fake.txt'
			});
			const fakeEntry = tests.buildFakeFileEntry();

			const actual = common.isAppliedFilter(settings.entryFilter, fakeEntry);

			assert.ok(!actual);
		});
	});

	describe('.setBasePathForEntryPath', () => {
		it('should set base path to entry path', () => {
			const root = process.cwd();
			const fullpath = path.join(root, 'file.txt');

			const expected = path.join('base', 'file.txt');

			const actual = common.setBasePathForEntryPath(fullpath, root, 'base');

			assert.strictEqual(actual, expected);
		});

		it('should correctly set empty base path to entry path', () => {
			const root = process.cwd();
			const fullpath = path.join(root, 'file.txt');

			const expected = 'file.txt';

			const actual = common.setBasePathForEntryPath(fullpath, root, '');

			assert.strictEqual(actual, expected);
		});
	});
});
