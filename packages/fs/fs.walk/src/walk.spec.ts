import * as assert from 'node:assert';
import * as fs from 'node:fs';
import type { Readable } from 'node:stream';
import {
	after,
	before,
	describe,
	it,
	type TestContext,
} from 'node:test';
import { walk, walkSync, walkStream } from './walk.js';
import { walk as walkPromise } from './walk-promises.js';
import { Settings } from './settings.js';
import type { ErrnoException, Entry } from './types/index.js';

const isFileEntry = (entry: Entry): boolean => !entry.dirent.isDirectory();

async function streamToPromise(stream: Readable): Promise<Entry[]> {
	const entries: Entry[] = [];

	return new Promise((resolve, reject) => {
		stream.on('data', (entry: Entry) => {
			entries.push(entry);
		});
		stream.once('error', reject);
		stream.once('end', () => {
			resolve(entries);
		});
	});
}

describe('Package', () => {
	before(() => {
		fs.rmSync('fixtures', { recursive: true, force: true });

		fs.mkdirSync('fixtures');
		fs.writeFileSync('fixtures/file.txt', '');
		fs.mkdirSync('fixtures/nested');
		fs.writeFileSync('fixtures/nested/file.txt', '');
	});

	after(() => {
		fs.rmSync('fixtures', { recursive: true, force: true });
	});

	describe('.walk (promise)', () => {
		it('should throw an error for non-exist directory', async () => {
			const action = walkPromise('non-exist-directory');

			await assert.rejects(async () => action, { code: 'ENOENT' });
		});

		it('should work without options or settings', async () => {
			const entries = await walkPromise('fixtures');

			assert.strictEqual(entries.length, 3);
		});

		it('should work with options', async () => {
			const entries = await walkPromise('fixtures', { entryFilter: isFileEntry });

			assert.strictEqual(entries.length, 2);
		});

		it('should work with settings', async () => {
			const settings = new Settings({ entryFilter: isFileEntry });

			const entries = await walkPromise('fixtures', settings);

			assert.strictEqual(entries.length, 2);
		});
	});

	describe('.walk', () => {
		it('should throw an error for non-exist directory', (t: TestContext, done) => {
			walk('non-exist-directory', (error, entries) => {
				t.assert.strictEqual(error?.code, 'ENOENT');
				t.assert.strictEqual(entries, undefined);
				done();
			});
		});

		it('should work without options or settings', (t: TestContext, done) => {
			walk('fixtures', (error, entries) => {
				t.assert.strictEqual(error, null);
				t.assert.strictEqual(entries.length, 3);
				done();
			});
		});

		it('should work with options', (t: TestContext, done) => {
			walk('fixtures', { entryFilter: isFileEntry }, (error, entries) => {
				t.assert.strictEqual(error, null);
				t.assert.strictEqual(entries.length, 2);
				done();
			});
		});

		it('should work with settings', (t: TestContext, done) => {
			const settings = new Settings({ entryFilter: isFileEntry });

			walk('fixtures', settings, (error, entries) => {
				t.assert.strictEqual(error, null);
				t.assert.strictEqual(entries.length, 2);
				done();
			});
		});
	});

	describe('.walkStream', () => {
		it('should throw an error for non-exist directory', async () => {
			const stream = walkStream('non-exist-directory');

			await assert.rejects(async () => streamToPromise(stream), (error: ErrnoException) => error.code === 'ENOENT');
		});

		it('should work without options or settings', async () => {
			const stream = walkStream('fixtures');
			const actual = await streamToPromise(stream);

			assert.strictEqual(actual.length, 3);
		});

		it('should work with options', async () => {
			const stream = walkStream('fixtures', { entryFilter: isFileEntry });
			const actual = await streamToPromise(stream);

			assert.strictEqual(actual.length, 2);
		});

		it('should work with settings', async () => {
			const settings = new Settings({ entryFilter: isFileEntry });
			const stream = walkStream('fixtures', settings);
			const actual = await streamToPromise(stream);

			assert.strictEqual(actual.length, 2);
		});
	});

	describe('.walkSync', () => {
		it('should throw an error for non-exist directory', () => {
			const isNotFoundError = (error: ErrnoException): boolean => error.code === 'ENOENT';

			assert.throws(() => walkSync('non-exist-directory'), isNotFoundError);
		});

		it('should work without options or settings', () => {
			const actual = walkSync('fixtures');

			assert.strictEqual(actual.length, 3);
		});

		it('should work with options', () => {
			const actual = walkSync('fixtures', { entryFilter: isFileEntry });

			assert.strictEqual(actual.length, 2);
		});

		it('should work with settings', () => {
			const settings = new Settings({ entryFilter: isFileEntry });

			const actual = walkSync('fixtures', settings);

			assert.strictEqual(actual.length, 2);
		});
	});
});
