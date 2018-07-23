import * as assert from 'assert';

import * as utils from './hook';

import Hook, { HookType } from '../../client/hook';

const noop = () => undefined;

const hooks = [
	new Hook(HookType.Before, noop),
	new Hook(HookType.BeforeEach, noop),
	new Hook(HookType.AfterEach, noop)
];

describe('Worker → Utils → Hook', () => {
	describe('.isHook', () => {
		it('should return true', () => {
			const hook = new Hook(HookType.Before, () => undefined);

			const actual = utils.isHook(hook);

			assert.ok(actual);
		});

		it('should return false', () => {
			const actual = utils.isHook(Object);

			assert.ok(!actual);
		});
	});

	describe('.getHooksWithTypes', () => {
		it('should return empty array', () => {
			const expected: Hook[] = [];

			const actual = utils.getHooksWithTypes(hooks, []);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return array of hooks', () => {
			const expected: Hook[] = [hooks[0], hooks[2]];

			const actual = utils.getHooksWithTypes(hooks, [HookType.Before, HookType.AfterEach]);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.isNestedHook', () => {
		it('should return true for BeforeEach hook', () => {
			const hook = new Hook(HookType.BeforeEach, noop);

			const actual = utils.isNestedHook(hook);

			assert.ok(actual);
		});

		it('should return true for BeforeEachIteration hook', () => {
			const hook = new Hook(HookType.BeforeEachIteration, noop);

			const actual = utils.isNestedHook(hook);

			assert.ok(actual);
		});

		it('should return true for AfterEach hook', () => {
			const hook = new Hook(HookType.AfterEach, noop);

			const actual = utils.isNestedHook(hook);

			assert.ok(actual);
		});

		it('should return true for AfterEachIteration hook', () => {
			const hook = new Hook(HookType.AfterEachIteration, noop);

			const actual = utils.isNestedHook(hook);

			assert.ok(actual);
		});

		it('should return false for Before hook', () => {
			const hook = new Hook(HookType.Before, noop);

			const actual = utils.isNestedHook(hook);

			assert.ok(!actual);
		});
	});
});
