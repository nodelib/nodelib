import * as assert from 'node:assert';
import { describe, it } from 'node:test';
import * as sinon from 'sinon';
import * as tests from '../tests/index.js';
import type { AsyncReaderInterface } from '../readers/async.js';
import { AsyncProvider, type AsyncCallback } from './async.js';

function createCallback(stub: sinon.SinonStub): AsyncCallback {
	return (...args): void => {
		stub(...args);
	};
}

class TestProvider extends AsyncProvider {
	public readonly reader: sinon.SinonStubbedInstance<AsyncReaderInterface>;

	constructor(reader: AsyncReaderInterface = new tests.TestAsyncReader()) {
		super(reader);

		this.reader = reader as sinon.SinonStubbedInstance<AsyncReaderInterface>;
	}
}

describe('Providers → Async', () => {
	describe('.read', () => {
		it('should call reader function with correct set of arguments', () => {
			const provider = new TestProvider();
			const fakeCallback = sinon.stub();

			provider.read('directory', createCallback(fakeCallback));

			assert.ok(provider.reader.read.called);
		});

		it('should call callback with error for failed launch', () => {
			const provider = new TestProvider();
			const fakeCallback = sinon.stub();

			provider.reader.onError.yields(tests.EPERM_ERRNO);

			provider.read('directory', createCallback(fakeCallback));

			assert.deepStrictEqual(fakeCallback.args, [[tests.EPERM_ERRNO]]);
		});

		it('should push entries to storage and call callback with array of entries', () => {
			const provider = new TestProvider();
			const fakeEntry = tests.buildFakeFileEntry();
			const fakeCallback = sinon.stub();

			provider.reader.onEntry.yields(fakeEntry);
			provider.reader.onEnd.yields();

			provider.read('directory', createCallback(fakeCallback));

			assert.deepStrictEqual(fakeCallback.args, [[null, [fakeEntry]]]);
		});
	});
});
