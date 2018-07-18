import * as assert from 'assert';

import * as utils from './group';

import Group from '../group';

describe('Client → Utils → Group', () => {
	describe('.isGroup', () => {
		it('should return true', () => {
			const group = new Group('title', [], {});

			const actual = utils.isGroup(group);

			assert.ok(actual);
		});

		it('should return false', () => {
			const actual = utils.isGroup(Object);

			assert.ok(!actual);
		});
	});
});
