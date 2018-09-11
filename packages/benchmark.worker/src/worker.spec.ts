import * as assert from 'assert';

import * as sinon from 'sinon';

import { Group, Hook, NSHook, Race } from '@nodelib/benchmark.client';
import { NSQueue } from '@nodelib/benchmark.queue';

import Worker from './worker';

class TestWorker extends Worker {
	public reportStub: sinon.SinonStub = sinon.stub();

	constructor(protected readonly _queue: NSQueue.Queue) {
		super(_queue);
	}

	protected _report(obj: Object): void {
		return this.reportStub(obj);
	}
}

function getHooksWithAllTypes(noop: sinon.SinonStub): Hook[] {
	/**
	 * So, the «enum» it's just an object that has property.
	 */
	const length = Object.keys(NSHook.Type).length / 2;

	return Array(length).fill(0).map((_, index) => new Hook(index, noop));
}

/**
 * R (Race)
 * H* (Hook @see {@link NSHook.Type})
 * G (Group)
 *
 * A (Warmup iteration count)
 * B (Work iteration count)
 *
 * Formula: H0 + H4 + [G ⅹ (H1 + H5)] + (A + B) ⅹ [(H2 + H6) + [G ⅹ (H3 + H7)]] + (A + B) ⅹ R
 */
function getExpectedCallsCount(warmup: number, work: number, group: number): number {
	const flattenHooks = 1 + 1 + (group * (1 + 1));
	const nestedHooks = (warmup + work) * ((1 + 1) + (group * (1 + 1)));
	const runs = (warmup + work) * 1;

	return flattenHooks + nestedHooks + runs;
}

describe('Worker', () => {
	describe('Constructor', () => {
		it('should return instance of class', () => {
			const worker = new TestWorker([]);

			assert.ok(worker instanceof Worker);
		});
	});

	describe('.start', () => {
		it('should throw error when there is no race at the specified index.', async () => {
			const worker = new TestWorker([]);

			try {
				await worker.start(0);
				throw new Error('An unexpected error was found.');
			} catch (err) {
				assert.strictEqual(err.message, 'Race with index 0 does not exist. The current queue has only 0 races.');
			}
		});

		it('should call report with object that have a correct structure', async () => {
			const noop = sinon.stub();

			const hooks = getHooksWithAllTypes(noop);
			const race = new Race('title', noop);
			const parent = new Group('title', [race, ...hooks], { warmupCount: 1, iterationCount: 2 });

			parent.group = undefined;

			const worker = new TestWorker([race]);

			await worker.start(0);

			const actual = worker.reportStub.firstCall.args[0];

			assert.strictEqual(actual.length, 2);

			assert.ok('IterationTime' in actual[0]);
		});

		it('should start the race and hooks in the correct sequence for flatten groups', async () => {
			const noop = sinon.stub();

			const hooks = getHooksWithAllTypes(noop);
			const race = new Race('title', noop);
			const parent = new Group('title', [race, ...hooks], { warmupCount: 1, iterationCount: 2 });

			parent.group = undefined;

			const worker = new TestWorker([race]);

			const expected = getExpectedCallsCount(1, 2, 1);

			await worker.start(0);

			const actual = noop.getCalls().length;

			assert.strictEqual(actual, expected);
		});

		it('should start the race and hooks in the correct sequence for nested groups', async () => {
			const noop = sinon.stub();

			const hooks = getHooksWithAllTypes(noop);
			const race = new Race('title', noop);

			const top = new Group('title', [race, ...hooks]);
			const middle = new Group('title', [...hooks, top], { iterationCount: 3 });
			const parent = new Group('title', [...hooks, middle], { warmupCount: 1, iterationCount: 2 });

			parent.group = undefined;

			const worker = new TestWorker([race]);

			const expected = getExpectedCallsCount(1, 3, 3);

			await worker.start(0);

			const actual = noop.getCalls().length;

			assert.strictEqual(actual, expected);
		});
	});
});
