import * as assert from 'assert';

import { Group, Race } from '@nodelib/benchmark.client';

import convert, { NSQueue } from './converter';

describe('Converter', () => {
	it('should return queue', () => {
		const firstRace = new Race('Nested', () => undefined);
		const first = new Group('Nested', [firstRace]);

		const secondRace = new Race('Nested', () => undefined);
		const second = new Group('Nested', [secondRace]);

		const parent = new Group('Parent', [first, second]);

		const expected: NSQueue.Queue = [
			firstRace,
			secondRace
		];

		const actual = convert(parent);

		assert.deepStrictEqual(actual, expected);
	});
});
