import * as assert from 'node:assert';
import * as path from 'node:path';

import { Stats } from '@nodelib/fs.macchiato';
import { describe, it } from 'mocha';
import * as fsStat from '@nodelib/fs.stat';

import * as fs from './adapters/fs';
import { Settings } from './settings';

describe('Settings', () => {
	it('should return instance with default values', () => {
		const settings = new Settings();

		assert.deepStrictEqual(settings.fs, fs.createFileSystemAdapter());
		assert.ok(!settings.followSymbolicLinks);
		assert.ok(!settings.stats);
		assert.strictEqual(settings.pathSegmentSeparator, path.sep);
		assert.ok(settings.fsStatSettings instanceof fsStat.Settings);
		assert.ok(settings.throwErrorOnBrokenSymbolicLink);
	});

	it('should return instance with custom values', () => {
		const lstatSync = (): Stats => new Stats();

		const settings = new Settings({
			fs: fs.createFileSystemAdapter({ lstatSync }),
			stats: true,
		});

		assert.deepStrictEqual(settings.fs, fs.createFileSystemAdapter({ lstatSync }));
		assert.ok(settings.stats);
	});
});
