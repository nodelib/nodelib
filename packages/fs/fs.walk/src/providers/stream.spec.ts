import * as assert from 'node:assert';
import { ReadableStream } from 'node:stream/web';

import * as tests from '../tests';
import { StreamProvider } from './stream';

describe('Providers → Stream', () => {
	describe('.read', () => {
		it('should return stream', () => {
			const reader = new tests.TestAsyncReader();
			const provider = new StreamProvider(reader);

			const stream = provider.read('directory');

			assert.ok(stream instanceof ReadableStream);
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

			try {
				await stream.getReader().read();
				assert.fail('Expected error');
			} catch (error) {
				assert.deepStrictEqual(error, tests.EPERM_ERRNO);
			}
		});

		it('should pass the entry to the stream', async () => {
			const reader = new tests.TestAsyncReader();
			const provider = new StreamProvider(reader);
			const fakeEntry = tests.buildFakeFileEntry();

			reader.onEntry.yieldsAsync(fakeEntry);

			const stream = provider.read('directory');

			const result = await stream.getReader().read();

			assert.ok(!result.done);
			assert.deepStrictEqual(result.value, fakeEntry);
		});

		it('should close the stream when passing null as an entry', async () => {
			const reader = new tests.TestAsyncReader();
			const provider = new StreamProvider(reader);

			reader.onEnd.yieldsAsync();

			const stream = provider.read('directory');

			// // Manually start the stream, emulating reading.
			// stream.resume();

			const actual = [];
			for await (const value of stream) {
				actual.push(value);
			}

			assert.equal(actual.length, 0);
		});

		it('should do not destroy the reader when it has already been destroyed', async () => {
			const reader = new tests.TestAsyncReader();
			const provider = new StreamProvider(reader);
			const stream = provider.read('directory');

			await stream.cancel();

			await assert.doesNotReject(stream.cancel());
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

		it('should support errors during async iteration', () => {
			const reader = new tests.TestAsyncReader();
			const provider = new StreamProvider(reader);

			const fakeEntry = tests.buildFakeFileEntry();
			reader.onEntry.yieldsAsync(fakeEntry);
			reader.onError.yieldsAsync(tests.EPERM_ERRNO);

			const stream = provider.read('directory');

			return assert.rejects(async () => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-empty
				for await (const _ of stream) {}
			}, tests.EPERM_ERRNO);
		});
	});
});
