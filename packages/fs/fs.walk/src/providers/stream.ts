import { Readable } from 'node:stream';
import type { AsyncReaderInterface } from '../readers/async.js';

export class StreamProvider {
	readonly #reader: AsyncReaderInterface;
	readonly #stream: Readable;

	constructor(reader: AsyncReaderInterface) {
		this.#reader = reader;
		this.#stream = this.#createOutputStream();
	}

	#createOutputStream(): Readable {
		return new Readable({
			objectMode: true,
			read() {/* noop */},
			destroy: (error, callback) => {
				if (!this.#reader.isDestroyed) {
					this.#reader.destroy();
				}

				callback(error);
			},
		});
	}

	public read(root: string): Readable {
		this.#reader.onError((error) => {
			this.#stream.emit('error', error);
		});

		this.#reader.onEntry((entry) => {
			this.#stream.push(entry);
		});

		this.#reader.onEnd(() => {
			this.#stream.push(null);
		});

		this.#reader.read(root);

		return this.#stream;
	}
}
