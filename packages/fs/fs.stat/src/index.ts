import * as async from './providers/async';
import * as sync from './providers/sync';
import Settings from './settings';

import type { Options } from './settings';
import type { Stats } from './types';

type AsyncCallback = async.AsyncCallback;

function stat(path: string, callback: AsyncCallback): void;
function stat(path: string, optionsOrSettings: Options | Settings, callback: AsyncCallback): void;
function stat(path: string, optionsOrSettingsOrCallback: AsyncCallback | Options | Settings, callback?: AsyncCallback): void {
	if (typeof optionsOrSettingsOrCallback === 'function') {
		async.read(path, getSettings(), optionsOrSettingsOrCallback);
		return;
	}

	async.read(path, getSettings(optionsOrSettingsOrCallback), callback as AsyncCallback);
}

declare namespace stat {
	function __promisify__(path: string, optionsOrSettings?: Options | Settings): Promise<Stats>;
}

function statSync(path: string, optionsOrSettings?: Options | Settings): Stats {
	const settings = getSettings(optionsOrSettings);

	return sync.read(path, settings);
}

function getSettings(settingsOrOptions: Options | Settings = {}): Settings {
	if (settingsOrOptions instanceof Settings) {
		return settingsOrOptions;
	}

	return new Settings(settingsOrOptions);
}

export { stat, statSync };
export { default as Settings } from './settings';

export type { AsyncCallback };
export type { FileSystemAdapter, StatSynchronousMethod, StatAsynchronousMethod } from './adapters/fs';
export type { Options } from './settings';
export type { Stats } from './types';
