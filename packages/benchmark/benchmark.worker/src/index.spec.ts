import * as assert from 'assert';

import * as pkg from './index';
import Worker, { NSWorker } from './worker';

describe('Package', () => {
	it('should return correct set of properties', () => {
		const expected: typeof pkg = {
			Worker,

			NSWorker
		};

		const actual = pkg;

		assert.deepStrictEqual(actual, expected);
	});
});
