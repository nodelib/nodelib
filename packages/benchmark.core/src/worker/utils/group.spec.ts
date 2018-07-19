import * as assert from 'assert';

import * as utils from './group';

import Group, { StrictGroupSettings } from '../../client/group';
import Hook, { HookType } from '../../client/hook';

const noop = () => undefined;

describe('Worker → Utils → Group', () => {
	describe('.getRelatedHooks', () => {
		it('should return empty array for groups withput hooks', () => {
			const parentGroup = new Group('title', []);
			const nestedGroup = new Group('title', []);

			nestedGroup.parent = parentGroup;

			const expected: Hook[] = [];

			const actual = utils.getRelatedHooks(nestedGroup);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return empty array', () => {
			const parentGroup = new Group('title', [new Hook(HookType.Before, noop)]);
			const nestedGroup = new Group('title', []);

			nestedGroup.parent = parentGroup;

			const expected: Hook[] = [];

			const actual = utils.getRelatedHooks(nestedGroup);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return array of hooks', () => {
			const hook = new Hook(HookType.BeforeEach, noop);
			const parentGroup = new Group('title', [hook]);
			const nestedGroup = new Group('title', []);

			nestedGroup.parent = parentGroup;

			const expected: Hook[] = [hook];

			const actual = utils.getRelatedHooks(nestedGroup);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.getRaceByIndex', () => {
		it('should throw an error when index is out of range', () => {
			const group = new Group('title', []);

			const expectedMessageRe = /RangeError: Race with index \(2\) does not exist\. The current group has only 0 races\./;

			assert.throws(() => utils.getRaceByIndex(group, 2), expectedMessageRe);
		});
	});

	describe('.getCombinedSettings', () => {
		it('should return combined settings', () => {
			const parentGroup = new Group('title', [], { warmupCount: 1, launchCount: 1, iterationCount: 10 });
			const nestedGroup = new Group('title', [], { iterationCount: 20 });

			nestedGroup.parent = parentGroup;

			const expected: StrictGroupSettings = {
				warmupCount: 1,
				launchCount: 1,
				iterationCount: 20
			};

			const actual = utils.getCombinedSettings(nestedGroup);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.getParents', () => {
		it('should return parents', () => {
			const parentGroup = new Group('title', []);
			const nestedGroup = new Group('title', []);

			nestedGroup.parent = parentGroup;

			const expected: Group[] = [parentGroup, nestedGroup];

			const actual = utils.getParents(nestedGroup);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return parents without top group', () => {
			const parentGroup = new Group('title', []);
			const nestedGroup = new Group('title', []);

			nestedGroup.parent = parentGroup;

			const expected: Group[] = [parentGroup];

			const actual = utils.getParents(nestedGroup, /* includeTopGroup */ false);

			assert.deepStrictEqual(actual, expected);
		});
	});
});
