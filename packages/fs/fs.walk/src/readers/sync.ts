
import type { FileSystemAdapterInterface } from '../adapters/fs.js';
import type { Settings } from '../settings.js';
import type { Entry, ErrnoException, QueueItem } from '../types/index.js';
import * as common from './common.js';

export type SyncReaderInterface = {
	read: (root: string) => Entry[];
};

export class SyncReader implements SyncReaderInterface {
	readonly #fs: FileSystemAdapterInterface;
	readonly #settings: Settings;
	readonly #queue = new Set<QueueItem>();
	readonly #storage: Entry[] = [];

	constructor(fs: FileSystemAdapterInterface, settings: Settings) {
		this.#fs = fs;
		this.#settings = settings;
	}

	#pushToQueue(directory: string, base: string | undefined): void {
		this.#queue.add({ directory, base });
	}

	#handleQueue(): void {
		for (const item of this.#queue) {
			this.#handleDirectory(item.directory, item.base);
		}
	}

	#handleDirectory(directory: string, base: string | undefined): void {
		try {
			const entries = this.#fs.scandirSync(directory, this.#settings.fsScandirSettings);

			for (const entry of entries) {
				this.#handleEntry(entry, base);
			}
		} catch (error) {
			this.#handleError(error as ErrnoException);
		}
	}

	#handleError(error: ErrnoException): void {
		if (common.isFatalError(this.#settings, error)) {
			throw error;
		}
	}

	#handleEntry(entry: Entry, base: string | undefined): void {
		const fullpath = entry.path;

		if (base !== undefined) {
			entry.path = common.joinPathSegments(base, entry.name, this.#settings.pathSegmentSeparator);
		}

		if (common.isAppliedFilter(this.#settings.entryFilter, entry)) {
			this.#pushToStorage(entry);
		}

		if (entry.dirent.isDirectory() && common.isAppliedFilter(this.#settings.deepFilter, entry)) {
			this.#pushToQueue(fullpath, base === undefined ? undefined : entry.path);
		}
	}

	#pushToStorage(entry: Entry): void {
		this.#storage.push(entry);
	}

	public read(root: string): Entry[] {
		const directory = common.replacePathSegmentSeparator(root, this.#settings.pathSegmentSeparator);

		this.#pushToQueue(directory, this.#settings.basePath);
		this.#handleQueue();

		return this.#storage;
	}
}
