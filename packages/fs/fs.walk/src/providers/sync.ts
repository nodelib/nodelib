import type { ISyncReader } from '../readers/sync.js';
import type { Entry } from '../types/index.js';

export class SyncProvider {
	readonly #reader: ISyncReader;

	constructor(reader: ISyncReader) {
		this.#reader = reader;
	}

	public read(root: string): Entry[] {
		return this.#reader.read(root);
	}
}
