import { Readable } from 'stream';
import AsyncReader from '../readers/async';
import Settings from '../settings';
import * as tests from '../tests/index';

export default class StreamProvider {
	protected readonly _reader: AsyncReader = new AsyncReader(this._settings);
	protected readonly _stream: Readable = new Readable({
		objectMode: true,
		read: tests.noop,
		destroy: this._reader.destroy.bind(this._reader)
	});

	constructor(private readonly _settings: Settings) { }

	public read(dir: string): Readable {
		this._reader.onError((error) => {
			this._stream.emit('error', error);
		});

		this._reader.onEntry((entry) => {
			this._stream.push(entry);
		});

		this._reader.onEnd(() => {
			this._stream.push(null);
		});

		this._reader.read(dir);

		return this._stream;
	}
}
