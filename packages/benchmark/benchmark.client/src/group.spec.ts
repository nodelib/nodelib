import * as assert from 'assert';

import * as tests from './tests';

import Group from './group';
import Hook, { NSHook } from './hook';
import Race from './race';

describe('Group', () => {
	describe('Constructor', () => {
		it('should return a instance of class', () => {
			const group = new Group('title', []);

			assert.ok(group instanceof Group);
		});

		it('should throw an error when child items contains groups and races at the same time', () => {
			const race = new Race('title', () => undefined);
			const group = new Group('Group', []);

			const expectedErrorMessageRe = /A group cannot contain groups and races at the same time/;

			assert.throws(() => new Group('Group', [race, group]), expectedErrorMessageRe);
		});

		it('should set parent group for all children items', () => {
			const hook = new Hook(NSHook.Type.Before, () => undefined);

			const nestedGroup = new Group('Nested', []);
			const parentGroup = new Group('Parent', [nestedGroup, hook]);

			assert.strictEqual(hook.group, parentGroup);
			assert.strictEqual(nestedGroup.group, parentGroup);
		});
	});

	describe('.groups', () => {
		it('should return children groups', () => {
			const nestedGroup = new Group('Nested', []);
			const parentGroup = new Group('Parent', [
				new Hook(NSHook.Type.Before, () => undefined),
				nestedGroup
			]);

			const expected = [nestedGroup];

			const actual = parentGroup.groups;

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.hooks', () => {
		it('should return children hooks', () => {
			const hook = new Hook(NSHook.Type.Before, () => undefined);
			const parentGroup = new Group('Parent', [
				new Group('Nested', []),
				hook
			]);

			const expected = [hook];

			const actual = parentGroup.hooks;

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.races', () => {
		it('should return children races', () => {
			const race = new Race('title', () => undefined);
			const parentGroup = new Group('Parent', [
				new Hook(NSHook.Type.Before, () => undefined),
				race
			]);

			const expected = [race];

			const actual = parentGroup.races;

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.accept', () => {
		it('should call a correct visit method', () => {
			const group = new Group('title', []);

			const visitor = new tests.visitor.TestVisitor();

			group.accept(visitor);

			assert.strictEqual(visitor.visitGroupStub.callCount, 1);
			assert.deepStrictEqual(visitor.visitGroupStub.firstCall.args, [group]);
		});
	});
});
