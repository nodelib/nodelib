import { EventEmitter } from 'events';

import * as fsScandir from '@nodelib/fs.scandir';
import * as fastq from 'fastq';

import Settings from '../settings';
import { Entry, Errno } from '../types/index';
import * as common from './common';

type EntryEventCallback = (entry: Entry) => void;
type ErrorEventCallback = (error: Errno) => void;
type EndEventCallback = () => void;

export default class AsyncReader {
	protected readonly _scandir: typeof fsScandir.scandir = fsScandir.scandir;
	protected readonly _emitter: EventEmitter = new EventEmitter();

	private readonly _queue: fastq.queue = fastq(this._worker.bind(this), this._settings.concurrency);
	private _isFatalError: boolean = false;
	private _isDestroyed: boolean = false;

	constructor(private readonly _root: string, private readonly _settings: Settings) {
		this._queue.drain = () => {
			if (!this._isFatalError) {
				this._emitter.emit('end');
			}
		};
	}

	public read(): EventEmitter {
		this._isFatalError = false;
		this._isDestroyed = false;

		setImmediate(() => {
			this._handleDirectory(this._root);
		});

		return this._emitter;
	}

	public destroy(): void {
		if (this._isDestroyed) {
			throw new Error('The reader is already destroyed');
		}

		this._isDestroyed = true;
		this._queue.killAndDrain();
	}

	public onEntry(callback: EntryEventCallback): void {
		this._emitter.on('entry', callback);
	}

	public onError(callback: ErrorEventCallback): void {
		this._emitter.once('error', callback);
	}

	public onEnd(callback: EndEventCallback): void {
		this._emitter.once('end', callback);
	}

	private _handleDirectory(dir: string): void {
		this._queue.push(dir, (error) => {
			if (error) {
				this._handleError(error);
			}
		});
	}

	private _worker(dir: string, done: fastq.done): void {
		this._scandir(dir, this._settings.fsScandirSettings, (error, entries) => {
			if (error) {
				return done(error, undefined);
			}

			for (const entry of entries) {
				this._handleEntry(entry);
			}

			done(null as unknown as Error, undefined);
		});
	}

	private _handleError(error: Error): void {
		if (!common.isFatalError(this._settings, error)) {
			return;
		}

		this._isFatalError = true;
		this._isDestroyed = true;
		this._emitter.emit('error', error);
	}

	private _handleEntry(entry: Entry): void {
		if (this._isDestroyed || this._isFatalError) {
			return;
		}

		const fullpath = entry.path;

		if (this._settings.basePath !== null) {
			entry.path = common.setBasePathForEntryPath(fullpath, this._root, this._settings.basePath);
		}

		if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
			this._emitEntry(entry);
		}

		if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
			this._handleDirectory(fullpath);
		}
	}

	private _emitEntry(entry: Entry): void {
		this._emitter.emit('entry', entry);
	}
}
