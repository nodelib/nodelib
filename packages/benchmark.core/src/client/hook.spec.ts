import * as assert from 'assert';

import * as sinon from 'sinon';

import Hook, { HookType } from './hook';

import TestVisitor from '../tests/visitor';

const noop = () => undefined;

describe('Client → Hook', () => {
	describe('Constructor', () => {
		it('should return instance of class', () => {
			const hook = new Hook(HookType.Before, noop);

			assert.ok(hook instanceof Hook);
		});
	});

	describe('.type', () => {
		it('should work as a getter', () => {
			const hook = new Hook(HookType.Before, noop);

			const expected = HookType.Before;

			assert.strictEqual(hook.type, expected);
		});
	});

	describe('.callback', () => {
		it('should work as a getter', () => {
			const hook = new Hook(HookType.Before, noop);

			const expected = noop;

			assert.strictEqual(hook.callback, expected);
		});
	});

	describe('.run', () => {
		it('should call a callback function', async () => {
			const callback = sinon.stub();
			const hook = new Hook(HookType.Before, callback);

			const expected = 1;

			await hook.run();

			assert.strictEqual(callback.callCount, expected);
		});
	});

	describe('.accept', () => {
		it('should call a correct visit method', () => {
			const hook = new Hook(HookType.Before, noop);

			const visitor = new TestVisitor();

			const expected = 1;

			hook.accept(visitor);

			assert.strictEqual(visitor.visitHookStub.callCount, expected);
			assert.deepStrictEqual(visitor.visitHookStub.firstCall.args, [hook]);
		});
	});
});
