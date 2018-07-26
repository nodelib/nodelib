import * as assert from 'assert';

import Reporter from './reporter';
import Runner, { RunnerResult } from './runner';

import Group from '../client/group';
import Race from '../client/race';

import { METER_PARTIALS_SEPARATOR, METER_PREFIX } from '../common/meter';
import { RACE_EMPTY_METHOD_TIME, RACE_ITERATION_MEMORY, RACE_ITERATION_SEPARATOR, RACE_ITERATION_TIME } from '../worker/worker';

import { GroupQueue } from '../client/converters/group-queue';

class TestReporter implements Reporter {
	public static calls: number = 0;

	public onStart = () => TestReporter.calls++;
	public onEnd = () => TestReporter.calls++;

	public onGroupStart = () => TestReporter.calls++;
	public onGroupEnd = () => TestReporter.calls++;

	public onRaceStart = () => TestReporter.calls++;
	public onRaceEnd = () => TestReporter.calls++;

	public onRaceIterationStart = () => TestReporter.calls++;
	public onRaceIterationEnd = () => TestReporter.calls++;
}

class TestRunner extends Runner {
	constructor(private readonly queue: GroupQueue, private readonly stdout: string) {
		super('module.js', new TestReporter());
	}

	protected _getQueue(): Promise<GroupQueue> {
		return Promise.resolve(this.queue);
	}

	protected _getRaceIterationResult(): Promise<string> {
		return Promise.resolve(this.stdout);
	}
}

function getStdout(launchCount: number): string {
	return [
		makeMeterLine(RACE_ITERATION_TIME, 100),
		makeMeterLine(RACE_EMPTY_METHOD_TIME, 10),
		makeMeterLine(RACE_ITERATION_MEMORY, 10),
		makeMeterLine(RACE_ITERATION_TIME, 1000),
		makeMeterLine(RACE_ITERATION_SEPARATOR, 1)
	].join('\n').repeat(launchCount);
}

function makeMeterLine(name: string, value: number): string {
	return [METER_PREFIX, name, value].join(METER_PARTIALS_SEPARATOR);
}

describe('Runner', () => {
	describe('Constructor', () => {
		it('should return instance of class', () => {
			const runner = new TestRunner([], '');

			assert.ok(runner instanceof Runner);
		});
	});

	describe('.start', () => {
		it('should work on the queue items', async () => {
			const race = new Race('title', () => undefined);
			const group = new Group('title', [race, race], {
				launchCount: 2,
				warmupCount: 1,
				iterationCount: 2
			});

			const runner = new TestRunner([group], getStdout(3));

			const expectedRace: RunnerResult.Race = {
				title: 'title',
				iterations: [
					[
						{ totalTime: 990, totalMemory: 10, markers: {} },
						{ totalTime: 990, totalMemory: 10, markers: {} }
					],
					[
						{ totalTime: 990, totalMemory: 10, markers: {} },
						{ totalTime: 990, totalMemory: 10, markers: {} }
					]
				]
			};

			const expected: RunnerResult.Group[] = [{
				title: 'title',
				races: [expectedRace, expectedRace]
			}];

			const actual = await runner.start();

			assert.deepStrictEqual(actual, expected);
			assert.strictEqual(TestReporter.calls, 16);
		});
	});
});
