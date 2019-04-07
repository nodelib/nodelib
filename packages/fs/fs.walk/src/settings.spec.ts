import * as assert from 'assert';

import * as fsScandir from '@nodelib/fs.scandir';

import Settings from './settings';

describe('Settings', () => {
	it('should return instance with default values', () => {
		const fsWalkSettings = new Settings();
		const fsScandirSettings = new fsScandir.Settings({
			fs: undefined,
			stats: undefined,
			followSymbolicLinks: undefined,
			throwErrorOnBrokenSymbolicLink: undefined
		});

		assert.deepStrictEqual(fsWalkSettings.fsScandirSettings, fsScandirSettings);
		assert.strictEqual(fsWalkSettings.deepFilter, null);
		assert.strictEqual(fsWalkSettings.entryFilter, null);
		assert.strictEqual(fsWalkSettings.errorFilter, null);
	});

	it('should return instance with custom values', () => {
		const filter = () => true;

		const fsWalkSettings = new Settings({ entryFilter: filter });

		assert.strictEqual(fsWalkSettings.entryFilter, filter);
	});
});
