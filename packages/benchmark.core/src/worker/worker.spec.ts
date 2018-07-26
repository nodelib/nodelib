import * as assert from 'assert';

import * as sinon from 'sinon';

import Worker, { WorkerTask } from './worker';

import Group from '../client/group';
import Hook, { HookType } from '../client/hook';
import Race from '../client/race';
import Meter from '../common/meter';

import { GroupQueue } from '../client/converters/group-queue';

class TestMeter extends Meter {
	protected _log(): void {
		// Empty
	}
}

class TestWorker extends Worker {
	protected readonly _meter: Meter = new TestMeter();

	constructor(private readonly queue: GroupQueue, _task: WorkerTask) {
		super(_task);
	}

	protected _getQueue(): Promise<GroupQueue> {
		return Promise.resolve(this.queue);
	}
}

function getHooksWithAllTypes(noop: sinon.SinonStub): Hook[] {
	/**
	 * So, the «enum» it's just an object that has property.
	 */
	const length = Object.keys(HookType).length / 2;

	return Array(length).fill(0).map((_, index) => new Hook(index, noop));
}

describe('Worker', () => {
	describe('Constructor', () => {
		it('should return instance of class', () => {
			const worker = new TestWorker([], {} as WorkerTask);

			assert.ok(worker instanceof Worker);
		});
	});

	describe('.start', () => {
		it('should start the race and hooks in the correct sequence for flatten group', async () => {
			const noop = sinon.stub();

			const hooks = getHooksWithAllTypes(noop);
			const race = new Race('title', noop);
			const group = new Group('title', [race, ...hooks], { warmupCount: 1, iterationCount: 2 });

			const worker = new TestWorker([group], {
				modulePath: '',
				groupIndex: 0,
				raceIndex: 0
			});

			const expected = 19;

			await worker.start();

			const actual = noop.getCalls().length;

			assert.strictEqual(actual, expected);
		});

		it('should start the race and hooks in the correct sequence for nested group', async () => {
			const noop = sinon.stub();

			const hooks = getHooksWithAllTypes(noop);
			const race = new Race('title', noop);

			const parentGroup = new Group('title', [...hooks], { warmupCount: 0, iterationCount: 2 });
			const nestedGroup = new Group('title', [race, ...hooks]);

			nestedGroup.parent = parentGroup;

			const worker = new TestWorker([parentGroup, nestedGroup], {
				modulePath: '',
				groupIndex: 1,
				raceIndex: 0
			});

			const expected = 20;

			await worker.start();

			const actual = noop.getCalls().length;

			assert.strictEqual(actual, expected);
		});
	});
});
