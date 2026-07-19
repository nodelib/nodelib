import * as assert from 'node:assert';
import * as path from 'node:path';

import { describe, it } from 'mocha';

import { Settings } from '../settings';
import * as tests from '../tests';
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
				errorFilter: (error) => error.code === 'ENOENT',
			});

			const actual = common.isFatalError(settings, tests.EPERM_ERRNO);

			assert.ok(actual);
		});

		it('should return false when the error can be suppressed', () => {
			const settings = new Settings({
				errorFilter: (error) => error.code === 'EPERM',
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
				entryFilter: (entry) => entry.name === 'fake.txt',
			});
			const fakeEntry = tests.buildFakeFileEntry();

			const actual = common.isAppliedFilter(settings.entryFilter, fakeEntry);

			assert.ok(actual);
		});

		it('should return false when the entry will be skipped', () => {
			const settings = new Settings({
				entryFilter: (entry) => entry.name !== 'fake.txt',
			});
			const fakeEntry = tests.buildFakeFileEntry();

			const actual = common.isAppliedFilter(settings.entryFilter, fakeEntry);

			assert.ok(!actual);
		});
	});

	describe('.replacePathSegmentSeparator', () => {
		it('should replace path segment separator', () => {
			const filepath = path.join('directory', 'file.txt');

			const expected = 'directory_file.txt';

			const actual = common.replacePathSegmentSeparator(filepath, '_');

			assert.strictEqual(actual, expected);
		});
	});

	describe('.getPathPrefix', () => {
		it('should append the separator only when it is missing', () => {
			const windowsPath = String.raw`C:\Users`;

			assert.strictEqual(common.getPathPrefix('directory', '/'), 'directory/');
			assert.strictEqual(common.getPathPrefix('a', '&'), 'a&');
			assert.strictEqual(common.getPathPrefix(windowsPath, '\\'), `${windowsPath}\\`);
		});

		it('should preserve paths that already end with the separator', () => {
			// Unix
			assert.strictEqual(common.getPathPrefix('/', '/'), '/');
			assert.strictEqual(common.getPathPrefix('//', '/'), '//');
			assert.strictEqual(common.getPathPrefix('/directory/', '/'), '/directory/');

			// Windows
			assert.strictEqual(common.getPathPrefix('C:/', '/'), 'C:/');
			assert.strictEqual(common.getPathPrefix('C:\\', '\\'), 'C:\\');
			assert.strictEqual(common.getPathPrefix('//?/C:/', '/'), '//?/C:/');
			assert.strictEqual(common.getPathPrefix('\\\\?\\C:\\', '\\'), '\\\\?\\C:\\');
		});

		it('should preserve an empty base path', () => {
			assert.strictEqual(common.getPathPrefix('', '/'), '');
		});
	});
});
