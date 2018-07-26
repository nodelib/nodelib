import * as assert from 'assert';

import Group, { GroupSettings } from './group';
import Hook, { HookType } from './hook';
import Race from './race';

import TestVisitor from '../tests/visitor';

const noop = () => undefined;

describe('Client → Group', () => {
	describe('Constructor', () => {
		it('should return instance of class', () => {
			const group = new Group('title', []);

			assert.ok(group instanceof Group);
		});

		it('should set parent group to children groups', () => {
			const nestedGroup = new Group('title', []);
			const parentGroup = new Group('title', [nestedGroup]);

			assert.deepStrictEqual(nestedGroup.parent, parentGroup);
		});

		it('should apply children hooks to your own', () => {
			const hook = new Hook(HookType.Before, noop);
			const group = new Group('title', [hook]);

			const expected = [hook];

			assert.deepStrictEqual(group.hooks, expected);
		});

		it('should apply children races to your own', () => {
			const race = new Race('title', noop);
			const group = new Group('title', [race]);

			const expected = [race];

			assert.deepStrictEqual(group.races, expected);
		});
	});

	describe('.title', () => {
		it('should work as a getter', () => {
			const group = new Group('title', []);

			const expected = 'title';

			assert.strictEqual(group.title, expected);
		});
	});

	describe('.children', () => {
		it('should work as a getter', () => {
			const hook = new Hook(HookType.Before, noop);

			const group = new Group('title', [hook]);

			const expected = [hook];

			assert.deepStrictEqual(group.children, expected);
		});
	});

	describe('.settings', () => {
		it('should work as a getter', () => {
			const group = new Group('title', [], { iterationCount: 1 });

			const expected: GroupSettings = { iterationCount: 1 };

			assert.deepStrictEqual(group.settings, expected);
		});
	});

	describe('.parent', () => {
		it('should work as a getter/setter', () => {
			const parentGroup = new Group('parent', []);
			const group = new Group('title', []);

			group.parent = parentGroup;

			assert.deepStrictEqual(group.parent, parentGroup);
		});
	});

	describe('.hooks', () => {
		it('should work as a getter', () => {
			const hook = new Hook(HookType.Before, noop);
			const group = new Group('title', [hook]);

			const expected: Hook[] = [hook];

			assert.deepStrictEqual(group.hooks, expected);
		});
	});

	describe('.races', () => {
		it('should work as a getter', () => {
			const race = new Race('title', noop);
			const group = new Group('title', [race]);

			const expected: Race[] = [race];

			assert.deepStrictEqual(group.races, expected);
		});
	});

	describe('.accept', () => {
		it('should call a correct visit method', () => {
			const group = new Group('title', []);
			const visitor = new TestVisitor();

			const expected = 1;

			group.accept(visitor);

			assert.strictEqual(visitor.visitGroupStub.callCount, expected);
			assert.deepStrictEqual(visitor.visitGroupStub.firstCall.args, [group]);
		});
	});
});
