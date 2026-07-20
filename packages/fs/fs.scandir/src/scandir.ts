import { Settings } from './settings.js';
import * as async from './providers/async.js';
import * as sync from './providers/sync.js';

import type { Options } from './settings.js';
import type { AsyncCallback, Entry } from './types/index.js';

export function scandir(path: string, callback: AsyncCallback): void;
export function scandir(path: string, optionsOrSettings: Options | Settings, callback: AsyncCallback): void;
export function scandir(path: string, optionsOrSettingsOrCallback: AsyncCallback | Options | Settings, callback?: AsyncCallback): void {
	if (typeof optionsOrSettingsOrCallback === 'function') {
		async.read(path, getSettings(), optionsOrSettingsOrCallback);
		return;
	}

	async.read(path, getSettings(optionsOrSettingsOrCallback), callback as AsyncCallback);
}

export declare namespace scandir {
	function __promisify__(path: string, optionsOrSettings?: Options | Settings): Promise<Entry[]>;
}

export function scandirSync(path: string, optionsOrSettings?: Options | Settings): Entry[] {
	const settings = getSettings(optionsOrSettings);

	return sync.read(path, settings);
}

function getSettings(settingsOrOptions: Options | Settings = {}): Settings {
	if (settingsOrOptions instanceof Settings) {
		return settingsOrOptions;
	}

	return new Settings(settingsOrOptions);
}
