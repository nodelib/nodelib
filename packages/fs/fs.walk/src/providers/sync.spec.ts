import * as assert from 'node:assert';
import { describe, it } from 'node:test';
import type { SinonStubbedInstance } from 'sinon';
import * as tests from '../tests/index.js';
import type { SyncReaderInterface } from '../readers/sync.js';
import { SyncProvider } from './sync.js';

class TestProvider extends SyncProvider {
	public readonly reader: SinonStubbedInstance<SyncReaderInterface>;

	constructor(reader: SyncReaderInterface = new tests.TestSyncReader()) {
		super(reader);

		this.reader = reader as SinonStubbedInstance<SyncReaderInterface>;
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
