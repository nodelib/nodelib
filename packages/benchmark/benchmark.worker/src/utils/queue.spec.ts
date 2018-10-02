import * as assert from 'assert';

import * as utils from './queue';

import { Race } from '@nodelib/benchmark.client';
import { NSQueue } from '@nodelib/benchmark.queue';

describe('Utils → Queue', () => {
	describe('.getRaceByIndex', () => {
		it('should throw an error', () => {
			const race = new Race('title', () => undefined);
			const queue: NSQueue.Queue = [race];

			const expectedMessageRe = /RangeError: Race with index 2 does not exist\. The current queue has only 1 races\./;

			assert.throws(() => utils.getRaceByIndex(queue, 2), expectedMessageRe);
		});

		it('should return race', () => {
			const race = new Race('title', () => undefined);
			const queue: NSQueue.Queue = [race];

			const expected = race;

			const actual = utils.getRaceByIndex(queue, 0);

			assert.deepStrictEqual(actual, expected);
		});
	});
});
