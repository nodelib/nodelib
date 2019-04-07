import * as assert from 'assert';

import * as sinon from 'sinon';

import AsyncReader from '../readers/async';
import Settings from '../settings';
import * as tests from '../tests/index';
import AsyncProvider from './async';

class TestProvider extends AsyncProvider {
	protected readonly _reader: AsyncReader = new tests.TestAsyncReader() as unknown as AsyncReader;

	constructor(_settings: Settings = new Settings()) {
		super(_settings);
	}

	public get reader(): tests.TestAsyncReader {
		return this._reader as unknown as tests.TestAsyncReader;
	}
}

describe('Providers → Async', () => {
	describe('.read', () => {
		it('should call reader function with correct set of arguments', () => {
			const provider = new TestProvider();
			const fakeCallback = sinon.stub();

			provider.read('directory', fakeCallback);

			assert.deepStrictEqual(provider.reader.read.args, [['directory']]);
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
