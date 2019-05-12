import * as assert from 'assert';
import * as fs from 'fs';
import { Readable } from 'stream';

import rimraf = require('rimraf');

import * as pkg from './index';
import { Errno } from './types';

const entryFilter = (entry: pkg.Entry) => !entry.dirent.isDirectory();

function streamToPromise(stream: Readable): Promise<pkg.Entry[]> {
	const entries: pkg.Entry[] = [];

	return new Promise((resolve, reject) => {
		stream.on('data', (entry: pkg.Entry) => entries.push(entry));
		stream.once('error', reject);
		stream.once('end', () => resolve(entries));
	});
}

describe('Package', () => {
	before(() => {
		rimraf.sync('fixtures');

		fs.mkdirSync('fixtures');
		fs.writeFileSync('fixtures/file.txt', '');
		fs.mkdirSync('fixtures/nested');
		fs.writeFileSync('fixtures/nested/file.txt', '');
	});

	after(() => {
		rimraf.sync('fixtures');
	});

	describe('.walk', () => {
		it('should throw an error for non-exist directory', (done) => {
			pkg.walk('non-exist-directory', (error, entries) => {
				assert.strictEqual(error.code, 'ENOENT');
				assert.strictEqual(entries, undefined);
				done();
			});
		});

		it('should work without options or settings', (done) => {
			pkg.walk('fixtures', (error, entries) => {
				assert.strictEqual(error, null);
				assert.strictEqual(entries.length, 3);
				done();
			});
		});

		it('should work with options', (done) => {
			pkg.walk('fixtures', { entryFilter }, (error, entries) => {
				assert.strictEqual(error, null);
				assert.strictEqual(entries.length, 2);
				done();
			});
		});

		it('should work with settings', (done) => {
			const settings = new pkg.Settings({ entryFilter });

			pkg.walk('fixtures', settings, (error, entries) => {
				assert.strictEqual(error, null);
				assert.strictEqual(entries.length, 2);
				done();
			});
		});
	});

	describe('.walkStream', () => {
		it('should throw an error for non-exist directory', async () => {
			const stream = pkg.walkStream('non-exist-directory');

			return assert.rejects(() => streamToPromise(stream), (error: Errno) => error.code === 'ENOENT');
		});

		it('should work without options or settings', async () => {
			const stream = pkg.walkStream('fixtures');
			const actual = await streamToPromise(stream);

			assert.strictEqual(actual.length, 3);
		});

		it('should work with options', async () => {
			const stream = pkg.walkStream('fixtures', { entryFilter });
			const actual = await streamToPromise(stream);

			assert.strictEqual(actual.length, 2);
		});

		it('should work with settings', async () => {
			const settings = new pkg.Settings({ entryFilter });
			const stream = pkg.walkStream('fixtures', settings);
			const actual = await streamToPromise(stream);

			assert.strictEqual(actual.length, 2);
		});
	});

	describe('.walkSync', () => {
		it('should throw an error for non-exist directory', () => {
			const matcher = (error: Errno) => error.code === 'ENOENT';

			assert.throws(() => pkg.walkSync('non-exist-directory'), matcher);
		});

		it('should work without options or settings', () => {
			const actual = pkg.walkSync('fixtures');

			assert.strictEqual(actual.length, 3);
		});

		it('should work with options', () => {
			const actual = pkg.walkSync('fixtures', { entryFilter });

			assert.strictEqual(actual.length, 2);
		});

		it('should work with settings', () => {
			const settings = new pkg.Settings({ entryFilter });

			const actual = pkg.walkSync('fixtures', settings);

			assert.strictEqual(actual.length, 2);
		});
	});
});
