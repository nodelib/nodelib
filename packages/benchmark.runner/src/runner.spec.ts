import * as assert from 'assert';

import Runner, { NSRunner } from './runner';

import { Group, Race } from '@nodelib/benchmark.client';
import { NSWorkerAnalyzer } from '@nodelib/benchmark.worker';

import ResultBox, { NSResultBox } from './result-box';

class TestRunner extends Runner {
	constructor(private readonly result: NSWorkerAnalyzer.Result, private readonly isBrokenWorker: boolean = false) {
		super();
	}

	protected _spawnWorker(): Promise<NSWorkerAnalyzer.Result> {
		const copiedResult = this.result.map((item) => Object.assign({}, item));

		if (this.isBrokenWorker) {
			return Promise.reject(new Error('So, we have an error'));
		}

		return Promise.resolve(copiedResult);
	}
}

function getWorkerResult(): NSWorkerAnalyzer.Result {
	return [
		{ IterationTime: 100, some: 40 },
		{ IterationTime: 100, some: 40 },
		{ IterationTime: 100, some: 40 }
	];
}

describe('Runner', () => {
	describe('Constructor', () => {
		it('should return instance of class', () => {
			const runner = new TestRunner([]);

			assert.ok(runner instanceof Runner);
		});
	});

	describe('.start', () => {
		const race = new Race('title', () => undefined);
		const group = new Group('title', [race], {
			launchCount: 2,
			warmupCount: 1,
			iterationCount: 2,
			parallel: 1
		});

		group.group = undefined;

		it('should throw an error when we have an error inside worker', async () => {
			const runner = new TestRunner([], /* isBrokenWorker */ true);

			try {
				await runner.start('some.bench.js', [race]);
				throw new Error('An unexpected error was found.');
			} catch (error) {
				assert.strictEqual(error.message, 'So, we have an error');
			}
		});

		it('should return a set of instances of ResultBox', async () => {
			const runner = new TestRunner(getWorkerResult());

			const iteration: NSResultBox.Iteration = {
				totalTime: 100,
				markers: { some: 40 }
			};

			const expected: NSResultBox.Launch[] = [
				[iteration, iteration, iteration],
				[iteration, iteration, iteration]
			];

			const resultBoxes = await runner.start('some.bench.js', [race]);
			const actual = resultBoxes.map((box) => box.launches);

			assert.deepStrictEqual(actual, [expected]);
		});

		it('should emit events of lifecycle for queue of races', async () => {
			const runner = new TestRunner(getWorkerResult());

			const actual: NSRunner.Message.Type[] = [];

			runner.on(NSRunner.MessageEvent.Name, (payload: NSRunner.Message.Payload) => {
				assert.ok(payload.box instanceof ResultBox);

				actual.push(payload.type);
			});

			await runner.start('some.bench.js', [race]);

			const expected: NSRunner.Message.Type[] = [
				NSRunner.Message.Type.Start,
				NSRunner.Message.Type.Launch,
				NSRunner.Message.Type.Launch,
				NSRunner.Message.Type.Finish
			];

			assert.deepStrictEqual(actual, expected);
		});
	});
});
