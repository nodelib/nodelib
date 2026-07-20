import * as assert from 'node:assert';

import { describe, it } from 'mocha';

import * as tests from '../tests/index.js';
import { SyncProvider } from './sync.js';

import type { SinonStubbedInstance } from 'sinon';
import type { ISyncReader } from '../readers/sync.js';

class TestProvider extends SyncProvider {
	public readonly reader: SinonStubbedInstance<ISyncReader>;

	constructor(
		reader: ISyncReader = new tests.TestSyncReader(),
	) {
		super(reader);

		this.reader = reader as SinonStubbedInstance<ISyncReader>;
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
