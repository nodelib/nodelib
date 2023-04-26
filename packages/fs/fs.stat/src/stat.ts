import * as async from './providers/async';
import * as sync from './providers/sync';
import { Settings } from './settings';

import type { Options } from './settings';
import type { AsyncCallback, Stats } from './types';

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
