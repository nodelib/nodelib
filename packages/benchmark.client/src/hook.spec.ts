import * as assert from 'assert';

import * as tests from './tests/index';

import Hook, { NSHook } from './hook';

describe('Hook', () => {
	describe('Constructor', () => {
		it('should return a instance of class', () => {
			const race = new Hook(NSHook.Type.Before, () => undefined);

			assert.ok(race instanceof Hook);
		});
	});

	describe('.run', () => {
		it('should call the asynchronous callback function', async () => {
			const hook = new Hook(NSHook.Type.Before, () => Promise.resolve(true));

			const actual = await hook.run();

			assert.ok(actual);
		});

		it('should call the synchronous callback function', async () => {
			const hook = new Hook(NSHook.Type.Before, () => true);

			const actual = await hook.run();

			assert.ok(actual);
		});
	});

	describe('.accept', () => {
		it('should call a correct visit method', () => {
			const hook = new Hook(NSHook.Type.Before, () => undefined);

			const visitor = new tests.visitor.TestVisitor();

			hook.accept(visitor);

			assert.strictEqual(visitor.visitHookStub.callCount, 1);
			assert.deepStrictEqual(visitor.visitHookStub.firstCall.args, [hook]);
		});
	});
});
