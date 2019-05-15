import * as assert from 'assert';

import SyncReader from '../readers/sync';
import Settings from '../settings';
import * as tests from '../tests/index';
import SyncProvider from './sync';

class TestProvider extends SyncProvider {
	protected readonly _reader: SyncReader = new tests.TestSyncReader() as unknown as SyncReader;

	constructor(_settings: Settings = new Settings()) {
		super(_settings);
	}

	public get reader(): tests.TestSyncReader {
		return this._reader as unknown as tests.TestSyncReader;
	}
}

describe('Providers → Sync', () => {
	describe('.read', () => {
		it('should call reader function with correct set of arguments and got result', () => {
			const provider = new TestProvider();
			const fakeEntry = tests.buildFakeFileEntry();

			provider.reader.read.returns([fakeEntry]);

			const actual = provider.read('directory');

			assert.deepStrictEqual(actual, [fakeEntry]);
			assert.deepStrictEqual(provider.reader.read.args, [['directory']]);
		});
	});
});