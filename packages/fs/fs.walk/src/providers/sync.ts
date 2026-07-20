import type { SyncReaderInterface } from '../readers/sync.js';
import type { Entry } from '../types/index.js';

export class SyncProvider {
	readonly #reader: SyncReaderInterface;

	constructor(reader: SyncReaderInterface) {
		this.#reader = reader;
	}

	public read(root: string): Entry[] {
		return this.#reader.read(root);
	}
}
