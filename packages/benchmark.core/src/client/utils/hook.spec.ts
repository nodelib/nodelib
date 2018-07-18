import * as assert from 'assert';

import * as utils from './hook';

import Hook, { HookType } from '../hook';

describe('Client → Utils → Hook', () => {
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
});
