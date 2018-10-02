import * as assert from 'assert';

import * as utils from './group';

import Group from '../group';

describe('Utils → Group', () => {
	describe('.is', () => {
		it('should return true', () => {
			const group = new Group('title', []);

			const actual = utils.is(group);

			assert.ok(actual);
		});

		it('should return false', () => {
			const actual = utils.is(Object);

			assert.ok(!actual);
		});
	});
});
