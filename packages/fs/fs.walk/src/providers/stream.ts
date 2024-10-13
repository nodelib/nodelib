import { ReadableStream } from 'node:stream/web';

import type { IAsyncReader } from '../readers';

export class StreamProvider {
	readonly #reader: IAsyncReader;
	#isDestroyed: boolean;

	constructor(reader: IAsyncReader) {
		this.#reader = reader;
		this.#isDestroyed = false;
	}

	public read(root: string): ReadableStream {
		return new ReadableStream({
			start: (controller) => {
				this.#reader.onError((error) => {
					this.#destroy();
					controller.error(error);
				});

				this.#reader.onEntry((entry) => {
					if (!this.#isDestroyed) {
						controller.enqueue(entry);
					}
				});

				this.#reader.onEnd(() => {
					this.#destroy();
					controller.close();
				});

				this.#reader.read(root);
			},
			cancel: () => {
				this.#destroy();
			},
		});
	}

	#destroy(): void {
		if (!this.#isDestroyed) {
			this.#reader.destroy();
			this.#isDestroyed = true;
		}
	}
}
