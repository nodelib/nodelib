import type { IAsyncReader } from '../readers/async';
import type { Entry, ErrnoException } from '../types';

export type AsyncCallback = (error: ErrnoException | null, entries: Entry[]) => void;
type FailureCallback = (error: ErrnoException) => void;

export class AsyncProvider {
	readonly #reader: IAsyncReader;

	constructor(reader: IAsyncReader) {
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
