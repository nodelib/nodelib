import * as assert from 'node:assert';

import { Stats } from '@nodelib/fs.macchiato';
import { describe, it } from 'mocha';

import * as adapter from './fs';

describe('Adapters → FileSystem', () => {
	it('should return original FS methods', () => {
		const expected: adapter.FileSystemAdapter = adapter.FILE_SYSTEM_ADAPTER;

		const actual = adapter.createFileSystemAdapter();

		assert.deepStrictEqual(actual, expected);
	});

	it('should return custom FS methods', () => {
		const customLstatSyncMethod = (): Stats => new Stats();

		const expected: adapter.FileSystemAdapter = {
			...adapter.FILE_SYSTEM_ADAPTER,
			lstatSync: customLstatSyncMethod,
		};

		const actual = adapter.createFileSystemAdapter({
			lstatSync: customLstatSyncMethod,
		});

		assert.deepStrictEqual(actual, expected);
	});
});
