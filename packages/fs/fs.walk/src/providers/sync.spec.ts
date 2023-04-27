import * as assert from 'assert';

import * as tests from '../tests';
import { SyncProvider } from './sync';

import type { ISyncReader } from '../readers';

class TestProvider extends SyncProvider {
	public readonly reader: sinon.SinonStubbedInstance<ISyncReader>;

	constructor(
		reader: ISyncReader = new tests.TestSyncReader(),
	) {
		super(reader);

		this.reader = reader as sinon.SinonStubbedInstance<ISyncReader>;
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
			assert.ok(provider.reader.read.called);
		});
	});
});
