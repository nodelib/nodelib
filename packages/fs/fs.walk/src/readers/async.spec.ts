import * as assert from 'node:assert';
import * as path from 'node:path';

import { Settings } from '../settings';
import * as tests from '../tests';
import { AsyncReader } from './async';

import type { IFileSystemAdapter } from '../adapters/fs';
import type * as sinon from 'sinon';
import type { Entry } from '../types';

class TestReader extends AsyncReader {
	public readonly fs: sinon.SinonStubbedInstance<IFileSystemAdapter>;

	constructor(
		settings: Settings = new Settings(),
		fs: IFileSystemAdapter = new tests.TestFileSystemAdapter(),
	) {
		super(fs, settings);

		this.fs = fs as sinon.SinonStubbedInstance<IFileSystemAdapter>;
	}
}

describe('Readers → Async', () => {
	describe('.read', () => {
		it('should emit "error" event when the first call of scandir is broken', (done) => {
			const reader = new TestReader();

			reader.fs.scandir.yields(tests.EPERM_ERRNO);

			reader.onError((error) => {
				assert.ok(error);
				done();
			});

			reader.read('non-exist-directory');
		});

		it('should emit "end" event when the first call of scandir is broken but this error can be suppressed', (done) => {
			const settings = new Settings({
				errorFilter: (error) => error.code === 'EPERM',
			});
			const reader = new TestReader(settings);

			reader.fs.scandir.yields(tests.EPERM_ERRNO);

			reader.onEnd(() => {
				done();
			});

			reader.read('non-exist-directory');
		});

		it('should do not emit events after first broken scandir call', (done) => {
			const reader = new TestReader();

			const firstFakeDirectoryEntry = tests.buildFakeDirectoryEntry({ name: 'a', path: 'directory/a' });
			const secondFakeDirectoryEntry = tests.buildFakeDirectoryEntry({ name: 'b', path: 'directory/b' });

			reader.fs.scandir.onFirstCall().yields(null, [firstFakeDirectoryEntry, secondFakeDirectoryEntry]);
			reader.fs.scandir.onSecondCall().yieldsAsync(tests.EPERM_ERRNO);
			reader.fs.scandir.onThirdCall().yieldsAsync(tests.EPERM_ERRNO);

			/**
			 * If the behavior is broken, then a third scandir call will trigger an unhandled error.
			 */
			reader.onError((error) => {
				assert.ok(error);
				done();
			});

			reader.read('directory');
		});

		it('should return entries', (done) => {
			const reader = new TestReader();

			const fakeDirectoryEntry = tests.buildFakeDirectoryEntry();
			const fakeFileEntry = tests.buildFakeFileEntry();

			reader.fs.scandir.onFirstCall().yields(null, [fakeDirectoryEntry]);
			reader.fs.scandir.onSecondCall().yields(null, [fakeFileEntry]);

			const entries: Entry[] = [];

			reader.onEntry((entry) => entries.push(entry));

			reader.onEnd(() => {
				assert.deepStrictEqual(entries, [fakeDirectoryEntry, fakeFileEntry]);
				done();
			});

			reader.read('directory');
		});

		it('should push to results only directories', (done) => {
			const settings = new Settings({ entryFilter: (entry) => !entry.dirent.isFile() });
			const reader = new TestReader(settings);

			const fakeDirectoryEntry = tests.buildFakeDirectoryEntry();
			const fakeFileEntry = tests.buildFakeFileEntry();

			reader.fs.scandir.onFirstCall().yields(null, [fakeDirectoryEntry]);
			reader.fs.scandir.onSecondCall().yields(null, [fakeFileEntry]);

			const entries: Entry[] = [];

			reader.onEntry((entry) => entries.push(entry));

			reader.onEnd(() => {
				assert.deepStrictEqual(entries, [fakeDirectoryEntry]);
				done();
			});

			reader.read('directory');
		});

		it('should do not read root directory', (done) => {
			const settings = new Settings({ deepFilter: () => false });
			const reader = new TestReader(settings);

			const fakeDirectoryEntry = tests.buildFakeDirectoryEntry();
			const fakeFileEntry = tests.buildFakeFileEntry();

			reader.fs.scandir.onFirstCall().yields(null, [fakeDirectoryEntry]);
			reader.fs.scandir.onSecondCall().yields(null, [fakeFileEntry]);

			const entries: Entry[] = [];

			reader.onEntry((entry) => entries.push(entry));

			reader.onEnd(() => {
				assert.deepStrictEqual(entries, [fakeDirectoryEntry]);
				done();
			});

			reader.read('directory');
		});

		it('should set base path to entry when the `basePath` option is exist', (done) => {
			const settings = new Settings({ basePath: 'base' });
			const reader = new TestReader(settings);

			const fakeDirectoryEntry = tests.buildFakeDirectoryEntry();
			const fakeFileEntry = tests.buildFakeFileEntry();

			reader.fs.scandir.onFirstCall().yields(null, [fakeDirectoryEntry]);
			reader.fs.scandir.onSecondCall().yields(null, [fakeFileEntry]);

			const entries: Entry[] = [];

			reader.onEntry((entry) => entries.push(entry));

			reader.onEnd(() => {
				assert.strictEqual(entries[0]?.path, path.join('base', fakeDirectoryEntry.name));
				assert.strictEqual(entries[1]?.path, path.join('base', 'fake', fakeFileEntry.name));
				done();
			});

			reader.read('directory');
		});

		it('should set base path to entry when the `basePath` option is exist and value is an empty string', (done) => {
			const settings = new Settings({ basePath: '' });
			const reader = new TestReader(settings);

			const fakeDirectoryEntry = tests.buildFakeDirectoryEntry();
			const fakeFileEntry = tests.buildFakeFileEntry();

			reader.fs.scandir.onFirstCall().yields(null, [fakeDirectoryEntry]);
			reader.fs.scandir.onSecondCall().yields(null, [fakeFileEntry]);

			const entries: Entry[] = [];

			reader.onEntry((entry) => entries.push(entry));

			reader.onEnd(() => {
				assert.strictEqual(entries[0]?.path, path.join(fakeDirectoryEntry.name));
				assert.strictEqual(entries[1]?.path, path.join('fake', fakeFileEntry.name));
				done();
			});

			reader.read('directory');
		});

		describe('AbortSignal', () => {
			it('should abort processing with abort signal', (done) => {
				const ac = new AbortController();

				const settings = new Settings({ signal: ac.signal });
				const reader = new TestReader(settings);

				reader.onError((error) => {
					assert.deepStrictEqual(error.name, 'AbortError');

					done();
				});

				reader.read('directory');

				setTimeout(() => {
					ac.abort();
				}, 100);
			});

			it('should work with already aborted signal', (done) => {
				const ac = new AbortController();

				ac.abort();

				const settings = new Settings({ signal: ac.signal });
				const reader = new TestReader(settings);

				reader.onError((error) => {
					assert.deepStrictEqual(error.name, 'AbortError');

					done();
				});

				reader.read('directory');
			});
		});
	});

	describe('.destroy', () => {
		it('should do not emit entries after destroy', (done) => {
			const reader = new TestReader();

			const firstFakeDirectoryEntry = tests.buildFakeDirectoryEntry({ name: 'a', path: 'directory/a' });
			const fakeFileEntry = tests.buildFakeFileEntry();

			reader.fs.scandir.onFirstCall().yields(null, [firstFakeDirectoryEntry]);
			reader.fs.scandir.onSecondCall().yields(null, [fakeFileEntry]);

			reader.onEntry((entry) => {
				if (entry.name === 'a') {
					reader.destroy();
				} else {
					assert.fail('should do not emit entries after destroy');
				}
			});

			reader.onEnd(() => {
				done();
			});

			reader.read('directory');
		});

		it('should mark stream as "destroyed" after first destroy', () => {
			const reader = new TestReader();

			reader.destroy();

			assert.ok(reader.isDestroyed);
		});

		it('should do nothing when trying to destroy reader twice', () => {
			const reader = new TestReader();

			reader.destroy();

			assert.doesNotThrow(() => {
				reader.destroy();
			});
		});
	});
});
