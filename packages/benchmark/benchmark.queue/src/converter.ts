import { Group, Race, Visitor } from '@nodelib/benchmark.client';

export namespace NSQueue {
	export type Queue = Race[];
}

class Converter implements Visitor {
	private readonly _queue: NSQueue.Queue = [];

	public convert(group: Group): NSQueue.Queue {
		group.accept(this);

		return this._queue;
	}

	public visitGroup(group: Group): void {
		group.races.forEach((item) => item.accept(this));
		group.groups.forEach((item) => item.accept(this));
	}

	public visitHook(): void {
		// Empty
	}

	public visitRace(race: Race): void {
		this._queue.push(race);
	}
}

export default function convert(group: Group): NSQueue.Queue {
	const converter = new Converter();

	return converter.convert(group);
}
