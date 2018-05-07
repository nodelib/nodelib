import * as assert from 'assert';

import * as tests from '../tests/index';

import * as optionsManager from '../managers/options';

import * as provider from './stat';

describe('Providers → Stat', () => {
	describe('.sync', () => {
		it('should throw error for broken path', () => {
			const options = optionsManager.prepare();

			const fsAdapter = new tests.FileSystemSyncFake({ throwLStatError: true });

			assert.throws(() => provider.sync(fsAdapter, 'broken_path', options), /^Error: FileSystemSyncFake$/);
		});

		it('should throw error for broken symlink', () => {
			const options = optionsManager.prepare();

			const fsAdapter = new tests.FileSystemSyncFake({
				isSymbolicLink: true,
				throwStatError: true
			});

			assert.throws(() => provider.sync(fsAdapter, 'broken_symlink', options), /^Error: FileSystemSyncFake$/);

		});

		it('should returns lstat for non-symlink entry', () => {
			const options = optionsManager.prepare();

			const fsAdapter = new tests.FileSystemSyncFake();

			const actual = provider.sync(fsAdapter, 'non_symlink', options);

			assert.equal(actual.uid, tests.StatType.lstat);
		});

		it('should returns stat for symlink entry', () => {
			const options = optionsManager.prepare();

			const fsAdapter = new tests.FileSystemSyncFake({ isSymbolicLink: true });

			const actual = provider.sync(fsAdapter, 'symlink', options);

			assert.equal(actual.uid, tests.StatType.stat);
			assert.ok(actual.isSymbolicLink());
		});

		it('should returns lstat for broken symlink entry when it possible', () => {
			const options = optionsManager.prepare({ throwErrorOnBrokenSymlinks: false });

			const fsAdapter = new tests.FileSystemSyncFake({
				isSymbolicLink: true,
				throwStatError: true
			});

			const actual = provider.sync(fsAdapter, 'broken_symlink', options);

			assert.equal(actual.uid, tests.StatType.lstat);
		});
	});

	describe('.async', () => {
		it('should throw error for broken path', async () => {
			const options = optionsManager.prepare();

			const fsAdapter = new tests.FileSystemAsyncFake({ throwLStatError: true });

			try {
				await provider.async(fsAdapter, 'broken_path', options);
				throw new Error('wow');
			} catch (err) {
				assert.equal(err, 'Error: FileSystemAsyncFake');
			}
		});

		it('should throw error for broken symlink', async () => {
			const options = optionsManager.prepare();

			const fsAdapter = new tests.FileSystemAsyncFake({
				isSymbolicLink: true,
				throwStatError: true
			});

			try {
				await provider.async(fsAdapter, 'broken_symlink', options);
				throw new Error('wow');
			} catch (err) {
				assert.equal(err, 'Error: FileSystemAsyncFake');
			}
		});

		it('should returns lstat for non-symlink entry', async () => {
			const options = optionsManager.prepare();

			const fsAdapter = new tests.FileSystemAsyncFake();

			const actual = await provider.async(fsAdapter, 'non_symlink', options);

			assert.equal(actual.uid, tests.StatType.lstat);
		});

		it('should returns stat for symlink entry', async () => {
			const options = optionsManager.prepare();

			const fsAdapter = new tests.FileSystemAsyncFake({ isSymbolicLink: true });

			const actual = await provider.async(fsAdapter, 'symlink', options);

			assert.equal(actual.uid, tests.StatType.stat);
			assert.ok(actual.isSymbolicLink());
		});

		it('should returns lstat for broken symlink entry when it possible', async () => {
			const options = optionsManager.prepare({ throwErrorOnBrokenSymlinks: false });

			const fsAdapter = new tests.FileSystemAsyncFake({
				isSymbolicLink: true,
				throwStatError: true
			});

			const actual = await provider.async(fsAdapter, 'broken_symlink', options);

			assert.equal(actual.uid, tests.StatType.lstat);
		});
	});

	describe('.isFollowedSymlink', () => {
		it('should returns true for followed symlink', () => {
			const options = optionsManager.prepare();
			const stat = tests.getFakeStats(tests.StatType.lstat, true);

			const actual = provider.isFollowedSymlink(stat, options);

			assert.ok(actual);
		});

		it('should returns false for not symlink', () => {
			const options = optionsManager.prepare();
			const stat = tests.getFakeStats(tests.StatType.lstat, false);

			const actual = provider.isFollowedSymlink(stat, options);

			assert.ok(!actual);
		});

		it('should returns false for not followed symlink', () => {
			const options = optionsManager.prepare({ followSymlinks: false });
			const stat = tests.getFakeStats(tests.StatType.lstat, true);

			const actual = provider.isFollowedSymlink(stat, options);

			assert.ok(!actual);
		});
	});
});
