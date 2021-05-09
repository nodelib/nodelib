import SyncReader from '../readers/sync';
import type Settings from '../settings';
import type { Entry } from '../types';

export default class SyncProvider {
	protected readonly _reader: SyncReader = new SyncReader(this._root, this._settings);

	constructor(private readonly _root: string, private readonly _settings: Settings) {}

	public read(): Entry[] {
		return this._reader.read();
	}
}
