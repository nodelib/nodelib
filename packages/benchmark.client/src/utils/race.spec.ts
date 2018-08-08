import * as assert from 'assert';

import * as utils from './race';

import Race from '../race';

describe('Utils → Race', () => {
	describe('.is', () => {
		it('should return true', () => {
			const race = new Race('title', () => undefined);

			const actual = utils.is(race);

			assert.ok(actual);
		});

		it('should return false', () => {
			const actual = utils.is(Object);

			assert.ok(!actual);
		});
	});
});
