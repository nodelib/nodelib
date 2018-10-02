import { Race } from '@nodelib/benchmark.client';
import { NSQueue } from '@nodelib/benchmark.queue';

/**
 * Returns race by index or throw an error when index out of range.
 */
export function getRaceByIndex(queue: NSQueue.Queue, index: number): Race | never {
	if (index < queue.length) {
		return queue[index];
	}

	throw new RangeError(`Race with index ${index} does not exist. The current queue has only ${queue.length} races.`);
}
