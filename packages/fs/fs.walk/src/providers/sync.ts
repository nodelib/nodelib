import type { ISyncReader } from '../readers';
import type { Entry } from '../types';

export class SyncProvider {
	readonly #reader: ISyncReader;

	constructor(reader: ISyncReader) {
		this.#reader = reader;
	}

	public read(root: string): Entry[] {
		return this.#reader.read(root);
	}
}
