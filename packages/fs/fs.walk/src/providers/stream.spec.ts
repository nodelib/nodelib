import * as assert from 'node:assert';
import { Readable } from 'node:stream';

import { describe, it } from 'mocha';

import * as tests from '../tests';
import { StreamProvider } from './stream';

describe('Providers → Stream', () => {
	describe('.read', () => {
		it('should return stream', () => {
			const reader = new tests.TestAsyncReader();
			const provider = new StreamProvider(reader);

			const stream = provider.read('directory');

			assert.ok(stream instanceof Readable);
		});

		it('should call the reader with correct set of arguments', () => {
			const reader = new tests.TestAsyncReader();
			const provider = new StreamProvider(reader);

			provider.read('directory');

			assert.deepStrictEqual(reader.read.firstCall.args, ['directory']);
		});

		it('should pass the error to the stream', async () => {
			const reader = new tests.TestAsyncReader();
			const provider = new StreamProvider(reader);

			reader.onError.yieldsAsync(tests.EPERM_ERRNO);

			const stream = provider.read('directory');

			const actual = await new Promise((resolve) => {
				stream.once('error', resolve);
			});

			assert.deepStrictEqual(actual, tests.EPERM_ERRNO);
		});

		it('should pass the entry to the stream', async () => {
			const reader = new tests.TestAsyncReader();
			const provider = new StreamProvider(reader);
			const fakeEntry = tests.buildFakeFileEntry();

			reader.onEntry.yieldsAsync(fakeEntry);

			const stream = provider.read('directory');

			const actual = await new Promise((resolve) => {
				stream.on('data', resolve);
			});

			assert.deepStrictEqual(actual, fakeEntry);
		});

		it('should close the stream when passing null as an entry', async () => {
			const reader = new tests.TestAsyncReader();
			const provider = new StreamProvider(reader);

			reader.onEnd.yieldsAsync();

			const stream = provider.read('directory');

			// Manually start the stream, emulating reading.
			stream.resume();

			const actual = await new Promise((resolve) => {
				stream.once('end', () => {
					resolve(true);
				});
			});

			assert.equal(actual, true);
		});

		it('should do not destroy the reader when it has already been destroyed', () => {
			const reader = new tests.TestAsyncReader();
			const provider = new StreamProvider(reader);

			const stream = provider.read('directory');

			assert.ok(!stream.destroyed);

			stream.destroy();

			assert.ok(stream.destroyed);
			assert.doesNotThrow(() => {
				stream.destroy();
			});
		});

		it('should support async iteration', async () => {
			const reader = new tests.TestAsyncReader();
			const provider = new StreamProvider(reader);

			const fakeEntry = tests.buildFakeFileEntry();
			reader.onEntry.yieldsAsync(fakeEntry);
			reader.onEnd.yieldsAsync();

			const stream = provider.read('directory');

			const results = [];
			for await (const x of stream) {
				results.push(x);
			}

			// Above loop will never complete, and cause a test timeout, if the stream
			// is not properly closed.

			assert.equal(results[0], fakeEntry);
		});

		it('should support errors during async iteration', async () => {
			const reader = new tests.TestAsyncReader();
			const provider = new StreamProvider(reader);

			const fakeEntry = tests.buildFakeFileEntry();
			reader.onEntry.yieldsAsync(fakeEntry);
			reader.onError.yieldsAsync(tests.EPERM_ERRNO);

			const stream = provider.read('directory');

			await assert.rejects(async () => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-empty
				for await (const _ of stream) {}
			}, tests.EPERM_ERRNO);
		});
	});
});
