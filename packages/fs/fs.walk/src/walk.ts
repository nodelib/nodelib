import { AsyncProvider, StreamProvider, SyncProvider } from './providers';
import { Settings } from './settings';
import { AsyncReader, SyncReader } from './readers';
import { FileSystemAdapter } from './adapters/fs';

import type { Options } from './settings';
import type { AsyncCallback } from './providers';
import type { Readable } from 'stream';
import type { Entry } from './types';

const fs = new FileSystemAdapter();

export function walk(directory: string, callback: AsyncCallback): void;
export function walk(directory: string, options: Options | Settings, callback: AsyncCallback): void;
export function walk(directory: string, options: AsyncCallback | Options | Settings, callback?: AsyncCallback): void {
	const optionsIsCallback = typeof options === 'function';

	const callback_ = optionsIsCallback ? options : callback as AsyncCallback;
	const settings = optionsIsCallback ? getSettings() : getSettings(options);

	const reader = new AsyncReader(fs, settings);
	const provider = new AsyncProvider(reader);

	provider.read(directory, callback_);
}

export declare namespace walk {
	function __promisify__(directory: string, optionsOrSettings?: Options | Settings): Promise<Entry[]>;
}

export function walkSync(directory: string, optionsOrSettings?: Options | Settings): Entry[] {
	const settings = getSettings(optionsOrSettings);

	const reader = new SyncReader(fs, settings);
	const provider = new SyncProvider(reader);

	return provider.read(directory);
}

export function walkStream(directory: string, optionsOrSettings?: Options | Settings): Readable {
	const settings = getSettings(optionsOrSettings);

	const reader = new AsyncReader(fs, settings);
	const provider = new StreamProvider(reader);

	return provider.read(directory);
}

function getSettings(settingsOrOptions: Options | Settings = {}): Settings {
	if (settingsOrOptions instanceof Settings) {
		return settingsOrOptions;
	}

	return new Settings(settingsOrOptions);
}
