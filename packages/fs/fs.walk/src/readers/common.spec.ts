import * as assert from 'node:assert';
import * as path from 'node:path';
import { describe, it } from 'node:test';
import { Settings } from '../settings.js';
import * as tests from '../tests/index.js';
import * as common from './common.js';

describe('Readers → Common', () => {
	describe('.isFatalError', () => {
		it('should return true when filter is not defined', () => {
			const settings = new Settings();

			const isActual = common.isFatalError(settings, tests.EPERM_ERRNO);

			assert.ok(isActual);
		});

		it('should return true when the error cannot be suppressed', () => {
			const settings = new Settings({
				errorFilter: (error) => error.code === 'ENOENT',
			});

			const isActual = common.isFatalError(settings, tests.EPERM_ERRNO);

			assert.ok(isActual);
		});

		it('should return false when the error can be suppressed', () => {
			const settings = new Settings({
				errorFilter: (error) => error.code === 'EPERM',
			});

			const isActual = common.isFatalError(settings, tests.EPERM_ERRNO);

			assert.ok(!isActual);
		});
	});

	describe('.isAppliedFilter', () => {
		it('should return true when the filter is not defined', () => {
			const settings = new Settings();
			const entry = tests.buildFakeFileEntry();

			const isActual = common.isAppliedFilter(settings.entryFilter, entry);

			assert.ok(isActual);
		});

		it('should return true when the entry will be applied', () => {
			const settings = new Settings({
				entryFilter: (entry) => entry.name === 'fake.txt',
			});
			const fakeEntry = tests.buildFakeFileEntry();

			const isActual = common.isAppliedFilter(settings.entryFilter, fakeEntry);

			assert.ok(isActual);
		});

		it('should return false when the entry will be skipped', () => {
			const settings = new Settings({
				entryFilter: (entry) => entry.name !== 'fake.txt',
			});
			const fakeEntry = tests.buildFakeFileEntry();

			const isActual = common.isAppliedFilter(settings.entryFilter, fakeEntry);

			assert.ok(!isActual);
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

	describe('.joinPathSegments', () => {
		it('should return concatenated string', () => {
			const expected = 'a&b';

			const actual = common.joinPathSegments('a', 'b', '&');

			assert.strictEqual(actual, expected);
		});

		it('should return second part of path when the first path is an empty string', () => {
			const expected = 'b';

			const actual = common.joinPathSegments('', 'b', '&');

			assert.strictEqual(actual, expected);
		});

		it('should return correct string when the first segment ens with the separator symbol', () => {
			// Unix
			assert.strictEqual(common.joinPathSegments('/', 'a', '/'), '/a');
			assert.strictEqual(common.joinPathSegments('//', 'a', '/'), '//a');
			assert.strictEqual(common.joinPathSegments('/a/', 'b', '/'), '/a/b');

			// Windows
			assert.strictEqual(common.joinPathSegments('C:/', 'Users', '/'), 'C:/Users');
			assert.strictEqual(common.joinPathSegments('C:\\', 'Users', '\\'), String.raw`C:\Users`);
			assert.strictEqual(common.joinPathSegments('//?/C:/', 'Users', '/'), '//?/C:/Users');
			assert.strictEqual(common.joinPathSegments('\\\\?\\C:\\', 'Users', '\\'), String.raw`\\?\C:\Users`);
		});
	});
});
