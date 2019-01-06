import * as assert from 'assert';
import * as fs from 'fs';

import * as adapter from './fs';

import { FileSystemAdapter } from './fs';

describe('Adapters → FileSystem', () => {
	it('should return original FS methods', () => {
		const expected: FileSystemAdapter = adapter.FILE_SYSTEM_ADAPTER;

		const actual = adapter.getFileSystemAdapter();

		assert.deepStrictEqual(actual, expected);
	});

	it('should return custom FS methods', () => {
		const customLstatSyncMethod: typeof fs.lstatSync = () => ({} as fs.Stats);

		const expected: FileSystemAdapter = {
			...adapter.FILE_SYSTEM_ADAPTER,
			lstatSync: customLstatSyncMethod
		};

		const actual = adapter.getFileSystemAdapter({
			lstatSync: customLstatSyncMethod
		});

		assert.deepStrictEqual(actual, expected);
	});
});
