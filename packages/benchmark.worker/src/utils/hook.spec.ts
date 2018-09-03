import * as assert from 'assert';

import * as utils from './hook';

import { Hook, NSHook } from '@nodelib/benchmark.client';

const noop = () => undefined;

describe('Utils → Hook', () => {
	describe('.isNestedHook', () => {
		it('should return true for BeforeEach hook', () => {
			const hook = new Hook(NSHook.Type.BeforeEach, noop);

			const actual = utils.isNestedHook(hook);

			assert.ok(actual);
		});

		it('should return true for BeforeEachIteration hook', () => {
			const hook = new Hook(NSHook.Type.BeforeEachIteration, noop);

			const actual = utils.isNestedHook(hook);

			assert.ok(actual);
		});

		it('should return true for AfterEach hook', () => {
			const hook = new Hook(NSHook.Type.AfterEach, noop);

			const actual = utils.isNestedHook(hook);

			assert.ok(actual);
		});

		it('should return true for AfterEachIteration hook', () => {
			const hook = new Hook(NSHook.Type.AfterEachIteration, noop);

			const actual = utils.isNestedHook(hook);

			assert.ok(actual);
		});

		it('should return false for Before hook', () => {
			const hook = new Hook(NSHook.Type.Before, noop);

			const actual = utils.isNestedHook(hook);

			assert.ok(!actual);
		});
	});

	describe('.getHooksWithTypes', () => {
		const hooks = [
			new Hook(NSHook.Type.Before, noop),
			new Hook(NSHook.Type.BeforeEach, noop),
			new Hook(NSHook.Type.AfterEach, noop)
		];

		it('should return empty array', () => {
			const expected: Hook[] = [];

			const actual = utils.getHooksWithTypes(hooks, []);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return array of hooks', () => {
			const expected: Hook[] = [hooks[0], hooks[2]];

			const actual = utils.getHooksWithTypes(hooks, [NSHook.Type.Before, NSHook.Type.AfterEach]);

			assert.deepStrictEqual(actual, expected);
		});
	});
});
