import * as assert from 'assert';

import * as utils from './race';

import Race from '../race';

describe('Client → Utils → Race', () => {
	describe('.isRace', () => {
		it('should return true', () => {
			const race = new Race('title', () => undefined);

			const actual = utils.isRace(race);

			assert.ok(actual);
		});

		it('should return false', () => {
			const actual = utils.isRace(Object);

			assert.ok(!actual);
		});
	});
});
