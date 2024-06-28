import { Settings } from './settings';
import * as async from './providers/async';
import * as sync from './providers/sync';

import type { Options } from './settings';
import type { Entry } from './types';

export function scandir(path: string, optionsOrSettings?: Options | Settings): Promise<Entry[]> {
	return async.read(path, getSettings(optionsOrSettings));
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
