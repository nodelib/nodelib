import * as assert from 'node:assert';
import * as path from 'node:path';

import { describe, it } from 'mocha';

import { Settings } from '../settings';
import * as tests from '../tests';
import { SyncReader } from './sync';

import type { IFileSystemAdapter } from '../adapters/fs';
import type * as sinon from 'sinon';

class TestReader extends SyncReader {
	public readonly fs: sinon.SinonStubbedInstance<IFileSystemAdapter>;

	constructor(
		settings: Settings = new Settings(),
		fs: IFileSystemAdapter = new tests.TestFileSystemAdapter(),
	) {
		super(fs, settings);

		this.fs = fs as sinon.SinonStubbedInstance<IFileSystemAdapter>;
	}
}

describe('Readers → Sync', () => {
	describe('.read', () => {
		it('should throw an error when the first call of scandir is broken', () => {
			const reader = new TestReader();

			reader.fs.scandirSync.throws(tests.EPERM_ERRNO);

			assert.throws(() => reader.read('non-exist-directory'), { code: 'EPERM' });
		});

		it('should return empty array when the first call of scandir is broken but this error can be suppressed', () => {
			const settings = new Settings({
				errorFilter: (error) => error.code === 'EPERM',
			});
			const reader = new TestReader(settings);

			reader.fs.scandirSync.throws(tests.EPERM_ERRNO);

			const actual = reader.read('non-exist-directory');

			assert.deepStrictEqual(actual, []);
		});

		it('should return entries', () => {
			const reader = new TestReader();
			const fakeDirectoryEntry = tests.buildFakeDirectoryEntry();
			const fakeFileEntry = tests.buildFakeFileEntry();

			reader.fs.scandirSync.onFirstCall().returns([fakeDirectoryEntry]);
			reader.fs.scandirSync.onSecondCall().returns([fakeFileEntry]);

			const expected = [fakeDirectoryEntry, fakeFileEntry];

			const actual = reader.read('directory');

			assert.deepStrictEqual(actual, expected);
		});

		it('should push to results only directories', () => {
			const settings = new Settings({ entryFilter: (entry) => !entry.dirent.isFile() });
			const reader = new TestReader(settings);

			const fakeDirectoryEntry = tests.buildFakeDirectoryEntry();
			const fakeFileEntry = tests.buildFakeFileEntry();

			reader.fs.scandirSync.onFirstCall().returns([fakeDirectoryEntry]);
			reader.fs.scandirSync.onSecondCall().returns([fakeFileEntry]);

			const expected = [fakeDirectoryEntry];

			const actual = reader.read('directory');

			assert.deepStrictEqual(actual, expected);
		});

		it('should do not read root directory', () => {
			const settings = new Settings({ deepFilter: () => false });
			const reader = new TestReader(settings);

			const fakeDirectoryEntry = tests.buildFakeDirectoryEntry();
			const fakeFileEntry = tests.buildFakeFileEntry();

			reader.fs.scandirSync.onFirstCall().returns([fakeDirectoryEntry]);
			reader.fs.scandirSync.onSecondCall().returns([fakeFileEntry]);

			const expected = [fakeDirectoryEntry];

			const actual = reader.read('directory');

			assert.deepStrictEqual(actual, expected);
		});

		it('should set base path to entry when the `basePath` option is exist', () => {
			const settings = new Settings({ basePath: 'base' });
			const reader = new TestReader(settings);

			const fakeDirectoryEntry = tests.buildFakeDirectoryEntry();
			const fakeFileEntry = tests.buildFakeFileEntry();

			reader.fs.scandirSync.onFirstCall().returns([fakeDirectoryEntry]);
			reader.fs.scandirSync.onSecondCall().returns([fakeFileEntry]);

			const actual = reader.read('directory');

			assert.strictEqual(actual[0]?.path, path.join('base', fakeDirectoryEntry.name));
			assert.strictEqual(actual[1]?.path, path.join('base', 'fake', fakeFileEntry.name));
		});

		it('should set base path to entry when the `basePath` option is exist and value is an empty string', () => {
			const settings = new Settings({ basePath: '' });
			const reader = new TestReader(settings);

			const fakeDirectoryEntry = tests.buildFakeDirectoryEntry();
			const fakeFileEntry = tests.buildFakeFileEntry();

			reader.fs.scandirSync.onFirstCall().returns([fakeDirectoryEntry]);
			reader.fs.scandirSync.onSecondCall().returns([fakeFileEntry]);

			const actual = reader.read('directory');

			assert.strictEqual(actual[0]?.path, fakeDirectoryEntry.name);
			assert.strictEqual(actual[1]?.path, path.join('fake', fakeFileEntry.name));
		});
	});
});
