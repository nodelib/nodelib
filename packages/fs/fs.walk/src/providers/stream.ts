import { Readable } from 'stream';

import AsyncReader from '../readers/async';

import type Settings from '../settings';

export default class StreamProvider {
	protected readonly _reader: AsyncReader;
	protected readonly _stream: Readable;

	constructor(private readonly _root: string, private readonly _settings: Settings) {
		this._reader = new AsyncReader(this._root, this._settings);
		this._stream = new Readable({
			objectMode: true,
			read: () => { /* noop */ },
			destroy: () => {
				if (!this._reader.isDestroyed) {
					this._reader.destroy();
				}
			},
		});
	}

	public read(): Readable {
		this._reader.onError((error) => {
			this._stream.emit('error', error);
		});

		this._reader.onEntry((entry) => {
			this._stream.push(entry);
		});

		this._reader.onEnd(() => {
			this._stream.push(null);
		});

		this._reader.read();

		return this._stream;
	}
}
