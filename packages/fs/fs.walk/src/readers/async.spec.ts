import * as assert from 'node:assert';
import * as path from 'node:path';
import { describe, it, type TestContext } from 'node:test';
import type * as sinon from 'sinon';
import { Settings } from '../settings.js';
import * as tests from '../tests/index.js';
import type { FileSystemAdapterInterface } from '../adapters/fs.js';
import type { Entry } from '../types/index.js';
import { AsyncReader } from './async.js';

class TestReader extends AsyncReader {
	public readonly fs: sinon.SinonStubbedInstance<FileSystemAdapterInterface>;

	constructor(
		settings: Settings = new Settings(),
		fs: FileSystemAdapterInterface = new tests.TestFileSystemAdapter(),
	) {
		super(fs, settings);

		this.fs = fs as sinon.SinonStubbedInstance<FileSystemAdapterInterface>;
	}
}

describe('Readers → Async', () => {
	describe('.read', () => {
		it('should emit "error" event when the first call of scandir is broken', (t: TestContext, done) => {
			const reader = new TestReader();

			reader.fs.scandir.yields(tests.EPERM_ERRNO);

			reader.onError((error) => {
				t.assert.strictEqual(error.code, 'EPERM');
				done();
			});

			reader.read('non-exist-directory');
		});

		it('should emit "error" event when the user entry filter throws an error', (t: TestContext, done) => {
			const errorFromUserFilter = new Error('This is an error from user filter.');

			const settings = new Settings({
				entryFilter() {
					throw errorFromUserFilter;
				},
			});

			const reader = new TestReader(settings);

			const fakeDirectoryEntry = tests.buildFakeDirectoryEntry();

			reader.fs.scandir.onFirstCall().yields(null, [fakeDirectoryEntry]);

			reader.onError((error) => {
				t.assert.strictEqual(error, errorFromUserFilter);
				done();
			});

			reader.read('directory');
		});

		it('should emit "error" event when the user deep filter throws an error', (t: TestContext, done) => {
			const errorFromUserFilter = new Error('This is an error from user filter.');

			const settings = new Settings({
				deepFilter() {
					throw errorFromUserFilter;
				},
			});

			const reader = new TestReader(settings);

			const fakeDirectoryEntry = tests.buildFakeDirectoryEntry();

			reader.fs.scandir.onFirstCall().yields(null, [fakeDirectoryEntry]);

			reader.onError((error) => {
				t.assert.strictEqual(error, errorFromUserFilter);
				done();
			});

			reader.read('directory');
		});

		it('should intercept errors from filters and redirect them to the error filtering function', (t: TestContext, done) => {
			const errorFromUserFilter = new Error('This is an error from user filter.');

			const settings = new Settings({
				deepFilter() {
					throw errorFromUserFilter;
				},
				// When true, the error is filtered. Otherwise, the error will be emitted.
				errorFilter(error) {
					return error !== errorFromUserFilter;
				},
			});

			const reader = new TestReader(settings);

			const fakeDirectoryEntry = tests.buildFakeDirectoryEntry();

			reader.fs.scandir.onFirstCall().yields(null, [fakeDirectoryEntry]);

			reader.onError((error) => {
				t.assert.strictEqual(error, errorFromUserFilter);
				done();
			});

			reader.read('directory');
		});

		it('should emit "end" event when the first call of scandir is broken but this error can be suppressed', (t: TestContext, done) => {
			const settings = new Settings({
				errorFilter: (error) => error.code === 'EPERM',
			});
			const reader = new TestReader(settings);

			reader.fs.scandir.yields(tests.EPERM_ERRNO);

			reader.onEnd(() => {
				t.assert.strictEqual(reader.fs.scandir.callCount, 1);
				done();
			});

			reader.read('non-exist-directory');
		});

		it('should do not emit events after first broken scandir call', (t: TestContext, done) => {
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
				t.assert.strictEqual(error.code, 'EPERM');
				done();
			});

			reader.read('directory');
		});

		it('should throw an error when error callback is not defined', () => {
			const reader = new TestReader();

			reader.fs.scandir.yields(tests.EPERM_ERRNO);

			assert.throws(() => {
				reader.read('non-exist-directory');
			}, { code: 'EPERM' });
		});

		it('should call error callback only once', () => {
			const reader = new TestReader();
			let calls = 0;

			reader.fs.scandir.onFirstCall().yields(tests.EPERM_ERRNO);
			reader.fs.scandir.onSecondCall().yields(tests.EPERM_ERRNO);

			reader.onError(() => {
				calls++;
			});

			reader.read('non-exist-directory');

			assert.strictEqual(calls, 1);
			assert.throws(() => {
				reader.read('non-exist-directory');
			}, { code: 'EPERM' });
			assert.strictEqual(calls, 1);
		});

		it('should call end callback only once', (t: TestContext, done) => {
			const reader = new TestReader();
			let calls = 0;

			reader.fs.scandir.onFirstCall().yields(null, []);
			reader.fs.scandir.onSecondCall().yields(null, []);

			reader.onEnd(() => {
				calls++;
			});

			reader.read('directory');
			reader.read('directory');

			setImmediate(() => {
				t.assert.strictEqual(calls, 1);
				done();
			});
		});

		it('should return entries', (t: TestContext, done) => {
			const reader = new TestReader();

			const fakeDirectoryEntry = tests.buildFakeDirectoryEntry();
			const fakeFileEntry = tests.buildFakeFileEntry();

			reader.fs.scandir.onFirstCall().yields(null, [fakeDirectoryEntry]);
			reader.fs.scandir.onSecondCall().yields(null, [fakeFileEntry]);

			const entries: Entry[] = [];

			reader.onEntry((entry) => {
				entries.push(entry);
			});

			reader.onEnd(() => {
				t.assert.deepStrictEqual(entries, [fakeDirectoryEntry, fakeFileEntry]);
				done();
			});

			reader.read('directory');
		});

		it('should push to results only directories', (t: TestContext, done) => {
			const settings = new Settings({ entryFilter: (entry) => !entry.dirent.isFile() });
			const reader = new TestReader(settings);

			const fakeDirectoryEntry = tests.buildFakeDirectoryEntry();
			const fakeFileEntry = tests.buildFakeFileEntry();

			reader.fs.scandir.onFirstCall().yields(null, [fakeDirectoryEntry]);
			reader.fs.scandir.onSecondCall().yields(null, [fakeFileEntry]);

			const entries: Entry[] = [];

			reader.onEntry((entry) => {
				entries.push(entry);
			});

			reader.onEnd(() => {
				t.assert.deepStrictEqual(entries, [fakeDirectoryEntry]);
				done();
			});

			reader.read('directory');
		});

		it('should do not read root directory', (t: TestContext, done) => {
			const settings = new Settings({ deepFilter: () => false });
			const reader = new TestReader(settings);

			const fakeDirectoryEntry = tests.buildFakeDirectoryEntry();
			const fakeFileEntry = tests.buildFakeFileEntry();

			reader.fs.scandir.onFirstCall().yields(null, [fakeDirectoryEntry]);
			reader.fs.scandir.onSecondCall().yields(null, [fakeFileEntry]);

			const entries: Entry[] = [];

			reader.onEntry((entry) => {
				entries.push(entry);
			});

			reader.onEnd(() => {
				t.assert.deepStrictEqual(entries, [fakeDirectoryEntry]);
				done();
			});

			reader.read('directory');
		});

		it('should set base path to entry when the `basePath` option is exist', (t: TestContext, done) => {
			const settings = new Settings({ basePath: 'base' });
			const reader = new TestReader(settings);

			const fakeDirectoryEntry = tests.buildFakeDirectoryEntry();
			const fakeFileEntry = tests.buildFakeFileEntry();

			reader.fs.scandir.onFirstCall().yields(null, [fakeDirectoryEntry]);
			reader.fs.scandir.onSecondCall().yields(null, [fakeFileEntry]);

			const entries: Entry[] = [];

			reader.onEntry((entry) => {
				entries.push(entry);
			});

			reader.onEnd(() => {
				t.assert.strictEqual(entries[0]?.path, path.join('base', fakeDirectoryEntry.name));
				t.assert.strictEqual(entries[1]?.path, path.join('base', 'fake', fakeFileEntry.name));
				done();
			});

			reader.read('directory');
		});

		it('should set base path to entry when the `basePath` option is exist and value is an empty string', (t: TestContext, done) => {
			const settings = new Settings({ basePath: '' });
			const reader = new TestReader(settings);

			const fakeDirectoryEntry = tests.buildFakeDirectoryEntry();
			const fakeFileEntry = tests.buildFakeFileEntry();

			reader.fs.scandir.onFirstCall().yields(null, [fakeDirectoryEntry]);
			reader.fs.scandir.onSecondCall().yields(null, [fakeFileEntry]);

			const entries: Entry[] = [];

			reader.onEntry((entry) => {
				entries.push(entry);
			});

			reader.onEnd(() => {
				t.assert.strictEqual(entries[0]?.path, path.join(fakeDirectoryEntry.name));
				t.assert.strictEqual(entries[1]?.path, path.join('fake', fakeFileEntry.name));
				done();
			});

			reader.read('directory');
		});

		describe('AbortSignal', () => {
			it('should abort processing with abort signal', (t: TestContext, done) => {
				const ac = new AbortController();

				const settings = new Settings({ signal: ac.signal });
				const reader = new TestReader(settings);

				reader.onError((error) => {
					t.assert.strictEqual(error.name, 'AbortError');

					done();
				});

				reader.read('directory');

				setTimeout(() => {
					ac.abort();
				}, 100);
			});

			it('should work with already aborted signal', (t: TestContext, done) => {
				const ac = new AbortController();

				ac.abort();

				const settings = new Settings({ signal: ac.signal });
				const reader = new TestReader(settings);

				reader.onError((error) => {
					t.assert.strictEqual(error.name, 'AbortError');

					done();
				});

				reader.read('directory');
			});
		});
	});

	describe('.destroy', () => {
		it('should do not emit entries after destroy', (t: TestContext, done) => {
			const reader = new TestReader();
			let entries = 0;

			const firstFakeDirectoryEntry = tests.buildFakeDirectoryEntry({ name: 'a', path: 'directory/a' });
			const fakeFileEntry = tests.buildFakeFileEntry();

			reader.fs.scandir.onFirstCall().yields(null, [firstFakeDirectoryEntry]);
			reader.fs.scandir.onSecondCall().yields(null, [fakeFileEntry]);

			reader.onEntry((entry) => {
				entries++;

				if (entry.name === 'a') {
					reader.destroy();
				}
			});

			reader.onEnd(() => {
				t.assert.strictEqual(entries, 1);
				done();
			});

			reader.read('directory');
		});

		it('should mark stream as "destroyed" after first destroy', () => {
			const reader = new TestReader();

			reader.destroy();

			assert.ok(reader.isDestroyed);
		});

		it('should do nothing when trying to destroy reader twice', (t: TestContext) => {
			const reader = new TestReader();

			reader.destroy();

			reader.destroy();

			t.assert.ok(reader.isDestroyed);
		});
	});
});
