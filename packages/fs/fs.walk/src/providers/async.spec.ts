import * as assert from 'node:assert';

import * as sinon from 'sinon';
import { describe, it } from 'mocha';

import * as tests from '../tests';
import { AsyncProvider } from './async';

import type { IAsyncReader } from '../readers';

class TestProvider extends AsyncProvider {
	public readonly reader: sinon.SinonStubbedInstance<IAsyncReader>;

	constructor(
		reader: IAsyncReader = new tests.TestAsyncReader(),
	) {
		super(reader);

		this.reader = reader as sinon.SinonStubbedInstance<IAsyncReader>;
	}
}

describe('Providers → Async', () => {
	describe('.read', () => {
		it('should call reader function with correct set of arguments', () => {
			const provider = new TestProvider();
			const fakeCallback = sinon.stub();

			provider.read('directory', fakeCallback);

			assert.ok(provider.reader.read.called);
		});

		it('should call callback with error for failed launch', () => {
			const provider = new TestProvider();
			const fakeCallback = sinon.stub();

			provider.reader.onError.yields(tests.EPERM_ERRNO);

			provider.read('directory', fakeCallback);

			assert.deepStrictEqual(fakeCallback.args, [[tests.EPERM_ERRNO]]);
		});

		it('should push entries to storage and call callback with array of entries', () => {
			const provider = new TestProvider();
			const fakeEntry = tests.buildFakeFileEntry();
			const fakeCallback = sinon.stub();

			provider.reader.onEntry.yields(fakeEntry);
			provider.reader.onEnd.yields();

			provider.read('directory', fakeCallback);

			assert.deepStrictEqual(fakeCallback.args, [[null, [fakeEntry]]]);
		});
	});
});
