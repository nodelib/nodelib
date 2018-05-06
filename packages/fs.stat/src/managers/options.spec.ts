import * as assert from 'assert';

import * as manager from './options';

import { Options, StrictOptions } from './options';

function getOptions(options?: Options): StrictOptions {
	return Object.assign<StrictOptions, Options | undefined>({
		throwErrorOnBrokenSymlinks: true,
		followSymlinks: true
	}, options);
}

describe('Managers → Options', () => {
	describe('.prepare', () => {
		it('should returns prepared options for empty object', () => {
			const expected = getOptions();

			const actual = manager.prepare();

			assert.deepEqual(actual, expected);
		});

		it('should returns prepared options for provided object', () => {
			const expected = getOptions({ throwErrorOnBrokenSymlinks: false });

			const actual = manager.prepare({ throwErrorOnBrokenSymlinks: false });

			assert.deepEqual(actual, expected);
		});
	});
});
