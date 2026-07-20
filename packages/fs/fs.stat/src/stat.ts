import * as async from './providers/async.js';
import * as sync from './providers/sync.js';
import { Settings } from './settings.js';

import type { Options } from './settings.js';
import type { AsyncCallback, Stats } from './types/index.js';

export function stat(path: string, callback: AsyncCallback): void;
export function stat(path: string, optionsOrSettings: Options | Settings, callback: AsyncCallback): void;
export function stat(path: string, optionsOrSettingsOrCallback: AsyncCallback | Options | Settings, callback?: AsyncCallback): void {
	if (typeof optionsOrSettingsOrCallback === 'function') {
		async.read(path, getSettings(), optionsOrSettingsOrCallback);
		return;
	}

	async.read(path, getSettings(optionsOrSettingsOrCallback), callback as AsyncCallback);
}

export declare namespace stat {
	function __promisify__(path: string, optionsOrSettings?: Options | Settings): Promise<Stats>;
}

export function statSync(path: string, optionsOrSettings?: Options | Settings): Stats {
	const settings = getSettings(optionsOrSettings);

	return sync.read(path, settings);
}

function getSettings(settingsOrOptions: Options | Settings = {}): Settings {
	if (settingsOrOptions instanceof Settings) {
		return settingsOrOptions;
	}

	return new Settings(settingsOrOptions);
}
