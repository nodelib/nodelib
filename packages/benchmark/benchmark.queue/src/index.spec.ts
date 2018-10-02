import * as assert from 'assert';

import * as pkg from './index';

import convert from './converter';

describe('Package', () => {
	it('should return correct set of properties', () => {
		const expected: typeof pkg = {
			convert
		};

		const actual = pkg;

		assert.deepStrictEqual(actual, expected);
	});
});
