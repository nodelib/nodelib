import * as async from './providers/async';
import * as sync from './providers/sync';
import { Settings } from './settings';

import type { Options } from './settings';
import type { Stats } from './types';

export function stat(path: string, optionsOrSettings?: Options | Settings): Promise<Stats> {
	return async.read(path, getSettings(optionsOrSettings));
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
