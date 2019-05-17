import * as fsScandir from '@nodelib/fs.scandir';

import Settings from '../settings';
import { Entry, Errno } from '../types/index';
import * as common from './common';

export default class SyncReader {
	protected readonly _scandir: typeof fsScandir.scandirSync = fsScandir.scandirSync;

	private readonly _storage: Set<Entry> = new Set();
	private readonly _queue: Set<string> = new Set();

	constructor(private readonly _root: string, private readonly _settings: Settings) { }

	public read(): Entry[] {
		this._pushToQueue(this._root);
		this._handleQueue();

		return Array.from(this._storage);
	}

	private _pushToQueue(dir: string): void {
		this._queue.add(dir);
	}

	private _handleQueue(): void {
		for (const item of this._queue.values()) {
			this._handleDirectory(item);
		}
	}

	private _handleDirectory(dir: string): void {
		try {
			const entries = this._scandir(dir, this._settings.fsScandirSettings);

			for (const entry of entries) {
				this._handleEntry(entry);
			}
		} catch (error) {
			this._handleError(error as Errno);
		}
	}

	private _handleError(error: Errno): void {
		if (!common.isFatalError(this._settings, error)) {
			return;
		}

		throw error;
	}

	private _handleEntry(entry: Entry): void {
		if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
			this._pushToStorage(entry);
		}

		if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
			this._handleDirectory(entry.path);
		}
	}

	private _pushToStorage(entry: Entry): void {
		this._storage.add(entry);
	}
}
