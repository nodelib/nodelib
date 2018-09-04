import * as assert from 'assert';

import { Race } from '@nodelib/benchmark.client';

import ResultBox, { NSResultBox } from './result-box';

describe('Result Box', () => {
	describe('Constructor', () => {
		it('should return instance of class', () => {
			const race = new Race('title', () => undefined);
			const box = new ResultBox(race, {
				iterationCount: 1,
				launchCount: 1,
				parallel: 1,
				warmupCount: 1
			});

			assert.ok(box instanceof ResultBox);
		});
	});

	describe('.medianOfLaunches', () => {
		it('should return median for each parameter in the results', () => {
			const race = new Race('title', () => undefined);
			const box = new ResultBox(race, {
				iterationCount: 1,
				launchCount: 1,
				parallel: 1,
				warmupCount: 1
			});

			box.addLaunch([{ totalTime: 3, markers: { some: 2 } }]);
			box.addLaunch([{ totalTime: 1, markers: { some: 3 } }]);
			box.addLaunch([{ totalTime: 2, markers: { some: 1 } }]);

			const expected: NSResultBox.Launch = [{ totalTime: 2, markers: { some: 2 } }];

			const actual = box.medianOfLaunches;

			assert.deepStrictEqual(actual, expected);
		});
	});
});
