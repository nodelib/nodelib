import * as assert from 'assert';

import * as sinon from 'sinon';

import Settings from '../settings';
import * as tests from '../tests/index';
import SyncReader from './sync';

class TestReader extends SyncReader {
	protected readonly _scandir: sinon.SinonStub = sinon.stub();

	constructor(_settings: Settings = new Settings()) {
		super(_settings);
	}

	public get scandir(): sinon.SinonStub {
		return this._scandir;
	}
}

describe('Readers → Sync', () => {
	describe('.read', () => {
		it('should throw an error when the first call of scandir is broken', () => {
			const reader = new TestReader();

			reader.scandir.throws(tests.EPERM_ERRNO);

			assert.throws(() => reader.read('non-exist-directory'), { code: 'EPERM' });
		});

		it('should return empty array when the first call of scandir is broken but this error can be suppressed', () => {
			const settings = new Settings({
				errorFilter: (error) => error.code === 'EPERM'
			});
			const reader = new TestReader(settings);

			reader.scandir.throws(tests.EPERM_ERRNO);

			const actual = reader.read('non-exist-directory');

			assert.deepStrictEqual(actual, []);
		});

		it('should return entries', () => {
			const reader = new TestReader();
			const fakeDirectoryEntry = tests.buildFakeDirectoryEntry();
			const fakeFileEntry = tests.buildFakeFileEntry();

			reader.scandir.onFirstCall().returns([fakeDirectoryEntry]);
			reader.scandir.onSecondCall().returns([fakeFileEntry]);

			const expected = [fakeDirectoryEntry, fakeFileEntry];

			const actual = reader.read('directory');

			assert.deepStrictEqual(actual, expected);
		});

		it('should push to results only directories', () => {
			const settings = new Settings({ entryFilter: (entry) => !entry.dirent.isFile() });
			const reader = new TestReader(settings);

			const fakeDirectoryEntry = tests.buildFakeDirectoryEntry();
			const fakeFileEntry = tests.buildFakeFileEntry();

			reader.scandir.onFirstCall().returns([fakeDirectoryEntry]);
			reader.scandir.onSecondCall().returns([fakeFileEntry]);

			const expected = [fakeDirectoryEntry];

			const actual = reader.read('directory');

			assert.deepStrictEqual(actual, expected);
		});

		it('should do not read root directory', () => {
			const settings = new Settings({ deepFilter: () => false });
			const reader = new TestReader(settings);

			const fakeDirectoryEntry = tests.buildFakeDirectoryEntry();
			const fakeFileEntry = tests.buildFakeFileEntry();

			reader.scandir.onFirstCall().returns([fakeDirectoryEntry]);
			reader.scandir.onSecondCall().returns([fakeFileEntry]);

			const expected = [fakeDirectoryEntry];

			const actual = reader.read('directory');

			assert.deepStrictEqual(actual, expected);
		});
	});
});