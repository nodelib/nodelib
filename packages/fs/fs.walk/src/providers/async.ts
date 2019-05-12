import AsyncReader from '../readers/async';
import Settings from '../settings';
import { Entry, Errno } from '../types/index';

type FailureCallback = (err: Errno) => void;
type SuccessCallback = (err: null, entries: Entry[]) => void;

export type AsyncCallback = (err: Errno, entries: Entry[]) => void;

export default class AsyncProvider {
	protected readonly _reader: AsyncReader = new AsyncReader(this._settings);

	private readonly _storage: Set<Entry> = new Set();

	constructor(private readonly _settings: Settings) { }

	public read(dir: string, callback: AsyncCallback): void {
		this._reader.onError((error) => {
			callFailureCallback(callback, error);
		});

		this._reader.onEntry((entry: Entry) => {
			this._storage.add(entry);
		});

		this._reader.onEnd(() => {
			callSuccessCallback(callback, Array.from(this._storage));
		});

		this._reader.read(dir);
	}
}

function callFailureCallback(callback: AsyncCallback, error: Errno): void {
	(callback as FailureCallback)(error);
}

function callSuccessCallback(callback: AsyncCallback, entries: Entry[]): void {
	(callback as unknown as SuccessCallback)(null, entries);
}
