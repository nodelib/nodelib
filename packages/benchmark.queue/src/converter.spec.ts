import * as assert from 'assert';

import { Group, Race } from '@nodelib/benchmark.client';

import convert, { NSQueue } from './converter';

describe('Converter', () => {
	it('should return queue', () => {
		const nestedRace = new Race('Nested', () => undefined);
		const nested = new Group('Nested', [nestedRace]);

		const parentRace = new Race('Parent', () => undefined);
		const parent = new Group('Parent', [parentRace, nested, parentRace, nested]);

		const expected: NSQueue.Queue = [
			parentRace,
			parentRace,
			nestedRace,
			nestedRace
		];

		const actual = convert(parent);

		assert.deepStrictEqual(actual, expected);
	});
});
