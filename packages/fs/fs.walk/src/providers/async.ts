import AsyncReader from '../readers/async';

import type Settings from '../settings';
import type { Entry, Errno } from '../types';

type FailureCallback = (error: Errno) => void;
type SuccessCallback = (error: null, entries: Entry[]) => void;

export type AsyncCallback = (error: Errno, entries: Entry[]) => void;

export default class AsyncProvider {
	protected readonly _reader: AsyncReader;

	private readonly _storage: Entry[] = [];

	constructor(private readonly _root: string, private readonly _settings: Settings) {
		this._reader = new AsyncReader(this._root, this._settings);
	}

	public read(callback: AsyncCallback): void {
		this._reader.onError((error) => {
			callFailureCallback(callback, error);
		});

		this._reader.onEntry((entry: Entry) => {
			this._storage.push(entry);
		});

		this._reader.onEnd(() => {
			callSuccessCallback(callback, this._storage);
		});

		this._reader.read();
	}
}

function callFailureCallback(callback: AsyncCallback, error: Errno): void {
	(callback as FailureCallback)(error);
}

function callSuccessCallback(callback: AsyncCallback, entries: Entry[]): void {
	(callback as unknown as SuccessCallback)(null, entries);
}
