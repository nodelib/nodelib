import * as assert from 'assert';

import Analyzer from './analyzer';

import { METER_PARTIALS_SEPARATOR, METER_PREFIX } from '../common/meter';
import { RACE_EMPTY_METHOD_TIME, RACE_ITERATION_MEMORY, RACE_ITERATION_SEPARATOR, RACE_ITERATION_TIME } from '../worker/worker';
import { RunnerResult } from './runner';

function makeMeterLine(name: string, value: number): string {
	return [METER_PREFIX, name, value].join(METER_PARTIALS_SEPARATOR);
}

describe('Runner → Analyzer', () => {
	describe('Constructor', () => {
		it('should return instance of class', () => {
			const analyzer = new Analyzer();

			assert.ok(analyzer instanceof Analyzer);
		});
	});

	describe('.analyze', () => {
		const analyzer = new Analyzer();

		const firstTime = 100;
		const secondTime = 1000;
		const memory = 100;
		const emptyMethodTime = 10;

		const firstOneMarker = 10;
		const secondOneMarker = 20;
		const firstTwoMarker = 10;

		it('should work with empty stdout', () => {
			const expected: RunnerResult.Statistic[] = [];

			const actual = analyzer.analyze('');

			assert.deepStrictEqual(actual, expected);
		});

		it('should extract meter lines from stdout for a single race iteration without markers', () => {
			const expected: RunnerResult.Statistic[] = [
				{
					totalTime: secondTime - firstTime - emptyMethodTime,
					totalMemory: memory,
					markers: {}
				}
			];

			const stdout = [
				makeMeterLine(RACE_ITERATION_TIME, firstTime),
				makeMeterLine(RACE_EMPTY_METHOD_TIME, emptyMethodTime),
				makeMeterLine(RACE_ITERATION_MEMORY, memory),
				makeMeterLine(RACE_ITERATION_TIME, secondTime),
				makeMeterLine(RACE_ITERATION_SEPARATOR, 1)
			].join('\n');

			const actual = analyzer.analyze(stdout);

			assert.deepStrictEqual(actual, expected);
		});

		it('should extract meter lines from stdout for a single race iteration with markers', () => {
			const expected: RunnerResult.Statistic[] = [
				{
					totalTime: secondTime - firstTime - emptyMethodTime,
					totalMemory: memory,
					markers: { one: 10, two: 10 }
				}
			];

			const stdout = [
				makeMeterLine(RACE_ITERATION_TIME, firstTime),
				makeMeterLine(RACE_EMPTY_METHOD_TIME, emptyMethodTime),
				makeMeterLine(RACE_ITERATION_MEMORY, memory),
				makeMeterLine(RACE_ITERATION_TIME, secondTime),
				makeMeterLine('one', firstOneMarker),
				makeMeterLine('two', firstTwoMarker),
				makeMeterLine('one', secondOneMarker),
				makeMeterLine(RACE_ITERATION_SEPARATOR, 1)
			].join('\n');

			const actual = analyzer.analyze(stdout);

			assert.deepStrictEqual(actual, expected);
		});

		it('should extract meter lines from stdout for a multiple race iterations', () => {
			const expected: RunnerResult.Statistic[] = [
				{
					totalTime: secondTime - firstTime - emptyMethodTime,
					totalMemory: memory,
					markers: {}
				},
				{
					totalTime: secondTime - firstTime - emptyMethodTime,
					totalMemory: memory,
					markers: {}
				}
			];

			const stdout = [
				makeMeterLine(RACE_ITERATION_TIME, firstTime),
				makeMeterLine(RACE_EMPTY_METHOD_TIME, emptyMethodTime),
				makeMeterLine(RACE_ITERATION_MEMORY, memory),
				makeMeterLine(RACE_ITERATION_TIME, secondTime),
				makeMeterLine(RACE_ITERATION_SEPARATOR, 1),

				makeMeterLine(RACE_ITERATION_TIME, firstTime),
				makeMeterLine(RACE_EMPTY_METHOD_TIME, emptyMethodTime),
				makeMeterLine(RACE_ITERATION_MEMORY, memory),
				makeMeterLine(RACE_ITERATION_TIME, secondTime),
				makeMeterLine(RACE_ITERATION_SEPARATOR, 1)
			].join('\n');

			const actual = analyzer.analyze(stdout);

			assert.deepStrictEqual(actual, expected);
		});
	});
});
