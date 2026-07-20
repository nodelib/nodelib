import type { Readable } from 'node:stream';
import { Settings, type Options } from './settings.js';
import { FileSystemAdapter } from './adapters/fs.js';
import { AsyncProvider, type AsyncCallback } from './providers/async.js';
import { AsyncReader } from './readers/async.js';
import { SyncReader } from './readers/sync.js';
import { SyncProvider } from './providers/sync.js';
import { StreamProvider } from './providers/stream.js';
import type { Entry } from './types/index.js';

const fs = new FileSystemAdapter();

export function walk(directory: string, callback: AsyncCallback): void;
export function walk(directory: string, options: Options | Settings, callback: AsyncCallback): void;
export function walk(directory: string, options: AsyncCallback | Options | Settings, callback?: AsyncCallback): void {
	const isOptionsIsCallback = typeof options === 'function';

	const callback_ = isOptionsIsCallback ? options : callback!;
	const settings = isOptionsIsCallback ? getSettings() : getSettings(options);

	const reader = new AsyncReader(fs, settings);
	const provider = new AsyncProvider(reader);

	provider.read(directory, callback_);
}

// This declaration models Node's legacy `util.promisify` extension point.
// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace walk {
	// eslint-disable-next-line @typescript-eslint/naming-convention
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
