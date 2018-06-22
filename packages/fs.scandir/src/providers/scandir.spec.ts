import * as assert from 'assert';

import * as tests from '../tests/index';

import * as optionsManager from '../managers/options';

import * as provider from './scandir';

import { DirEntry } from '../types/entry';

describe('Providers → Scandir', () => {
	describe('.sync', () => {
		it('should throw error for broken root path', () => {
			const fsAdapter = new tests.FileSystemSyncFake({ throwReaddirError: true });
			const options = optionsManager.prepare();

			assert.throws(() => provider.sync(fsAdapter, 'fake_path', options), /^Error: FileSystemSyncFake$/);
		});

		it('should throw error for broken entry', () => {
			const fsAdapter = new tests.FileSystemSyncFake({ throwStatError: true });
			const options = optionsManager.prepare();

			assert.throws(() => provider.sync(fsAdapter, 'fake_path', options), /^Error: FileSystemSyncFake$/);
		});

		it('should returns array of entries', () => {
			const fsAdapter = new tests.FileSystemSyncFake();
			const options = optionsManager.prepare();

			const expected: string[] = ['.a', 'bbb', 'c', 'd', 'eeee', 'f'];

			const entries = provider.sync(fsAdapter, 'fake_path', options);
			const actual = entries.map((entry) => entry.name);

			assert.deepStrictEqual(actual, expected);
		});

		it('should returns filtered array of entries by name and path', () => {
			const fsAdapter = new tests.FileSystemSyncFake();
			const options = optionsManager.prepare({
				preFilter: (name, path) => name.startsWith('.') && path.endsWith('.a')
			});

			const expected: string[] = ['.a'];

			const entries = provider.sync(fsAdapter, 'fake_path', options);
			const actual = entries.map((entry) => entry.name);

			assert.deepStrictEqual(actual, expected);
		});

		it('should returns filtered array of entries by entry name', () => {
			const fsAdapter = new tests.FileSystemSyncFake();
			const options = optionsManager.prepare({
				filter: (entry) => entry.name.startsWith('.')
			});

			const expected: string[] = ['.a'];

			const entries = provider.sync(fsAdapter, 'fake_path', options);
			const actual = entries.map((entry) => entry.name);

			assert.deepStrictEqual(actual, expected);
		});

		it('should returns sorted array of entries by name length', () => {
			const fsAdapter = new tests.FileSystemSyncFake();
			const options = optionsManager.prepare({
				sort: (a, b) => b.name.length - a.name.length
			});

			const expected: string[] = ['eeee', 'bbb', '.a', 'c', 'd', 'f'];

			const entries = provider.sync(fsAdapter, 'fake_path', options);
			const actual = entries.map((entry) => entry.name);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.async', () => {
		it('should throw error for broken root path', async () => {
			const fsAdapter = new tests.FileSystemAsyncFake({ throwReaddirError: true });
			const options = optionsManager.prepare();

			try {
				await provider.async(fsAdapter, 'fake_path', options);
			} catch (err) {
				assert.strictEqual(err.message, 'FileSystemAsyncFake');
			}
		});

		it('should throw error for broken entry', async () => {
			const fsAdapter = new tests.FileSystemAsyncFake({ throwStatError: true });
			const options = optionsManager.prepare();

			try {
				await provider.async(fsAdapter, 'fake_path', options);
			} catch (err) {
				assert.strictEqual(err.message, 'FileSystemAsyncFake');
			}
		});

		it('should returns array of entries', async () => {
			const fsAdapter = new tests.FileSystemAsyncFake();
			const options = optionsManager.prepare();

			const expected: string[] = ['.a', 'bbb', 'c', 'd', 'eeee', 'f'];

			const entries = await provider.async(fsAdapter, 'fake_path', options);
			const actual = entries.map((entry) => entry.name);

			assert.deepStrictEqual(actual, expected);
		});

		it('should returns filtered array of entries by name', async () => {
			const fsAdapter = new tests.FileSystemAsyncFake();
			const options = optionsManager.prepare({
				preFilter: (name) => name.startsWith('.')
			});

			const expected: string[] = ['.a'];

			const entries = await provider.async(fsAdapter, 'fake_path', options);
			const actual = entries.map((entry) => entry.name);

			assert.deepStrictEqual(actual, expected);
		});

		it('should returns filtered array of entries by entry name', async () => {
			const fsAdapter = new tests.FileSystemAsyncFake();
			const options = optionsManager.prepare({
				filter: (entry) => entry.name.startsWith('.')
			});

			const expected: string[] = ['.a'];

			const entries = await provider.async(fsAdapter, 'fake_path', options);
			const actual = entries.map((entry) => entry.name);

			assert.deepStrictEqual(actual, expected);
		});

		it('should returns sorted array of entries by name length', async () => {
			const fsAdapter = new tests.FileSystemAsyncFake();
			const options = optionsManager.prepare({
				sort: (a, b) => b.name.length - a.name.length
			});

			const expected: string[] = ['eeee', 'bbb', '.a', 'c', 'd', 'f'];

			const entries = await provider.async(fsAdapter, 'fake_path', options);
			const actual = entries.map((entry) => entry.name);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.makeDirEntry', () => {
		it('should returns DirEntry', () => {
			const options = optionsManager.prepare();
			const stats = tests.getFakeStats();

			const expected: DirEntry = {
				name: 'name',
				path: 'root/name',
				ino: 0,
				isDirectory: false,
				isFile: true,
				isSymlink: false
			};

			const actual = provider.makeDirEntry('name', 'root/name', stats, options);

			assert.deepStrictEqual(actual, expected);
		});

		it('should returns DirEntry with fs.Stats', () => {
			const options = optionsManager.prepare({ stats: true });
			const stats = tests.getFakeStats();

			const expected = 0;

			const actual = provider.makeDirEntry('name', 'root/name', stats, options);

			assert.strictEqual(actual.stats!.ino, expected); /* tslint:disable-line no-non-null-assertion */
		});
	});
});
