import * as assert from 'assert';

import * as utils from './hook';

import Hook, { NSHook } from '../hook';

const noop = () => undefined;

describe('Utils → Hook', () => {
	describe('.is', () => {
		it('should return true', () => {
			const hook = new Hook(NSHook.Type.Before, noop);

			const actual = utils.is(hook);

			assert.ok(actual);
		});

		it('should return false', () => {
			const actual = utils.is(Object);

			assert.ok(!actual);
		});
	});
});
