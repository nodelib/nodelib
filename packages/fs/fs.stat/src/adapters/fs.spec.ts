import * as assert from 'assert';
import * as fs from 'fs';

import * as adapter from './fs';

describe('Adapters → FileSystem', () => {
	it('should return original FS methods', () => {
		const expected: adapter.FileSystemAdapter = adapter.FILE_SYSTEM_ADAPTER;

		const actual = adapter.createFileSystemAdapter();

		assert.deepStrictEqual(actual, expected);
	});

	it('should return custom FS methods', () => {
		const customLstatSyncMethod: typeof fs.lstatSync = () => ({} as fs.Stats);

		const expected: adapter.FileSystemAdapter = {
			...adapter.FILE_SYSTEM_ADAPTER,
			lstatSync: customLstatSyncMethod
		};

		const actual = adapter.createFileSystemAdapter({
			lstatSync: customLstatSyncMethod
		});

		assert.deepStrictEqual(actual, expected);
	});
});
