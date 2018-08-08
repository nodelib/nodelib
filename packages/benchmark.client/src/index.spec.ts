import * as assert from 'assert';

import * as pkg from './index';

import Client from './client';

import Group from './group';
import Hook, { NSHook } from './hook';
import Race from './race';

import { Visitor } from './contexts/visitable';

describe('Package', () => {
	it('should return correct set of properties', () => {
		const expected: typeof pkg = {
			Client,

			Group,
			Hook,
			Race,

			NSHook,

			Visitor
		};

		const actual = pkg;

		assert.deepStrictEqual(actual, expected);
	});
});
