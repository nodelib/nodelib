import * as assert from 'assert';

import { Stats } from '@nodelib/fs.macchiato';

import * as adapter from './fs';

describe('Adapters → FileSystem', () => {
	it('should return original FS methods', () => {
		const expected: adapter.FileSystemAdapter = adapter.FILE_SYSTEM_ADAPTER;

		const actual = adapter.createFileSystemAdapter();

		assert.deepStrictEqual(actual, expected);
	});

	it('should return custom FS methods', () => {
		const lstatSync = (): Stats => new Stats();

		const expected: adapter.FileSystemAdapter = {
			...adapter.FILE_SYSTEM_ADAPTER,
			lstatSync
		};

		const actual = adapter.createFileSystemAdapter({ lstatSync });

		assert.deepStrictEqual(actual, expected);
	});
});
