import * as assert from 'assert';

import * as pkg from './index';

import ResultBox from './result-box';
import Runner, { NSRunner } from './runner';

describe('Package', () => {
	it('should return correct set of properties', () => {
		const expected: typeof pkg = {
			Runner,
			NSRunner,

			ResultBox
		};

		const actual = pkg;

		assert.deepStrictEqual(actual, expected);
	});
});
