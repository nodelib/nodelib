import * as assert from 'assert';

import GroupQueueConverter from './group-queue';

import Group from '../group';

describe('Client → Converters → GroupQueue', () => {
	describe('Constructor', () => {
		it('should return instance of class', () => {
			const converter = new GroupQueueConverter();

			assert.ok(converter instanceof GroupQueueConverter);
		});
	});

	describe('.convert', () => {
		it('should convert the group to group queue', () => {
			const converter = new GroupQueueConverter();

			const group = new Group('title', []);

			const expected = [group];

			const actual = converter.convert(group);

			assert.deepStrictEqual(actual, expected);
		});

		it('should convert nested groups to group queue', () => {
			const converter = new GroupQueueConverter();

			const nestedGroup = new Group('title', []);
			const parentGroup = new Group('title', [nestedGroup]);

			nestedGroup.parent = parentGroup;

			const expected = [parentGroup, nestedGroup];

			const actual = converter.convert(parentGroup);

			assert.deepStrictEqual(actual, expected);
		});
	});
});
