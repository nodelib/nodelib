import * as assert from 'assert';

import WorkerAnalyzer, { NSWorkerAnalyzer } from './analyzer';

import * as tests from './tests/index';
import { NSWorker } from './worker';

describe('Worker → WorkerAnalyzer', () => {
	describe('.analyze', () => {
		it('should return a result for metric with more than one values', () => {
			const analyzer = new WorkerAnalyzer();

			const expected: NSWorkerAnalyzer.Result = [{
				label: 1 // 5 - (3 + 1)
			}];

			const lines = [
				tests.meter.makeMeterLine(NSWorker.Symbols.IterationStart, 0),
				tests.meter.makeMeterLine('label', 1),
				tests.meter.makeMeterLine('label', 3),
				tests.meter.makeMeterLine('label', 5),
				tests.meter.makeMeterLine(NSWorker.Symbols.IterationEnd, 0)
			];

			const actual = analyzer.analyze(lines.join('\n'));

			assert.deepStrictEqual(actual, expected);
		});

		it('should return a result for metric with one value', () => {
			const analyzer = new WorkerAnalyzer();

			const expected: NSWorkerAnalyzer.Result = [{ label: 1 }];

			const lines = [
				tests.meter.makeMeterLine(NSWorker.Symbols.IterationStart, 0),
				tests.meter.makeMeterLine('label', 1),
				tests.meter.makeMeterLine(NSWorker.Symbols.IterationEnd, 0)
			];

			const actual = analyzer.analyze(lines.join('\n'));

			assert.deepStrictEqual(actual, expected);
		});

		it('should return a result for different metrics', () => {
			const analyzer = new WorkerAnalyzer();

			const expected: NSWorkerAnalyzer.Result = [{
				labelA: 1, // 2 - 1
				labelB: 1,
				labelC: 1 // 2 - 1
			}];

			const lines = [
				tests.meter.makeMeterLine(NSWorker.Symbols.IterationStart, 0),
				tests.meter.makeMeterLine('labelA', 1),
				tests.meter.makeMeterLine('labelB', 1),
				tests.meter.makeMeterLine('labelA', 2),
				tests.meter.makeMeterLine('labelC', 1),
				tests.meter.makeMeterLine('labelC', 2),
				tests.meter.makeMeterLine(NSWorker.Symbols.IterationEnd, 0)
			];

			const actual = analyzer.analyze(lines.join('\n'));

			assert.deepStrictEqual(actual, expected);
		});
	});
});
