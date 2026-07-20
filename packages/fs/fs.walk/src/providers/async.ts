import type { AsyncReaderInterface } from '../readers/async.js';
import type { Entry, ErrnoException } from '../types/index.js';

// Node-style callbacks report successful completion with null.
// eslint-disable-next-line @typescript-eslint/no-restricted-types
export type AsyncCallback = (error: ErrnoException | null, entries: Entry[]) => void;
type FailureCallback = (error: ErrnoException) => void;

export class AsyncProvider {
	readonly #reader: AsyncReaderInterface;

	constructor(reader: AsyncReaderInterface) {
		this.#reader = reader;
	}

	public read(root: string, callback: AsyncCallback): void {
		const entries: Entry[] = [];

		this.#reader.onError((error) => {
			callFailureCallback(callback, error);
		});

		this.#reader.onEntry((entry: Entry) => {
			entries.push(entry);
		});

		this.#reader.onEnd(() => {
			callSuccessCallback(callback, entries);
		});

		this.#reader.read(root);
	}
}

function callFailureCallback(callback: AsyncCallback, error: ErrnoException): void {
	(callback as FailureCallback)(error);
}

function callSuccessCallback(callback: AsyncCallback, entries: Entry[]): void {
	callback(null, entries);
}
