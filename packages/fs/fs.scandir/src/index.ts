import * as async from './providers/async';
import * as sync from './providers/sync';
import Settings from './settings';

import type { Options } from './settings';
import type { Entry } from './types';

type AsyncCallback = async.AsyncCallback;

function scandir(path: string, callback: AsyncCallback): void;
function scandir(path: string, optionsOrSettings: Options | Settings, callback: AsyncCallback): void;
function scandir(path: string, optionsOrSettingsOrCallback: AsyncCallback | Options | Settings, callback?: AsyncCallback): void {
	if (typeof optionsOrSettingsOrCallback === 'function') {
		async.read(path, getSettings(), optionsOrSettingsOrCallback);
		return;
	}

	async.read(path, getSettings(optionsOrSettingsOrCallback), callback as AsyncCallback);
}

declare namespace scandir {
	function __promisify__(path: string, optionsOrSettings?: Options | Settings): Promise<Entry[]>;
}

function scandirSync(path: string, optionsOrSettings?: Options | Settings): Entry[] {
	const settings = getSettings(optionsOrSettings);

	return sync.read(path, settings);
}

function getSettings(settingsOrOptions: Options | Settings = {}): Settings {
	if (settingsOrOptions instanceof Settings) {
		return settingsOrOptions;
	}

	return new Settings(settingsOrOptions);
}

export { scandir, scandirSync };
export { default as Settings } from './settings';

export type { AsyncCallback };
export type { FileSystemAdapter, ReaddirSynchronousMethod, ReaddirAsynchronousMethod } from './adapters/fs';
export type { Dirent, Entry } from './types';
export type { Options } from './settings';
