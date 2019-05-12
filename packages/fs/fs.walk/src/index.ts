import { Readable } from 'stream';

import { Dirent, FileSystemAdapter } from '@nodelib/fs.scandir';

import AsyncProvider, { AsyncCallback } from './providers/async';
import StreamProvider from './providers/stream';
import SyncProvider from './providers/sync';
import Settings, { DeepFilterFunction, EntryFilterFunction, ErrorFilterFunction, Options } from './settings';
import { Entry } from './types/index';

function walk(path: string, callback: AsyncCallback): void;
function walk(path: string, optionsOrSettings: Options | Settings, callback: AsyncCallback): void;
function walk(path: string, optionsOrSettingsOrCallback: Options | Settings | AsyncCallback, callback?: AsyncCallback): void {
	if (typeof optionsOrSettingsOrCallback === 'function') {
		return new AsyncProvider(getSettings()).read(path, optionsOrSettingsOrCallback);
	}

	new AsyncProvider(getSettings(optionsOrSettingsOrCallback)).read(path, callback as AsyncCallback);
}

declare namespace walk {
	function __promisify__(path: string, optionsOrSettings?: Options | Settings): Promise<Entry[]>;
}

function walkSync(dir: string, optionsOrSettings?: Options | Settings): Entry[] {
	const settings = getSettings(optionsOrSettings);
	const provider = new SyncProvider(settings);

	return provider.read(dir);
}

function walkStream(dir: string, optionsOrSettings?: Options | Settings): Readable {
	const settings = getSettings(optionsOrSettings);
	const provider = new StreamProvider(settings);

	return provider.read(dir);
}

function getSettings(settingsOrOptions: Settings | Options = {}): Settings {
	if (settingsOrOptions instanceof Settings) {
		return settingsOrOptions;
	}

	return new Settings(settingsOrOptions);
}

export {
	walk,
	walkSync,
	walkStream,
	Settings,

	AsyncCallback,
	Dirent,
	Entry,
	FileSystemAdapter,
	Options,
	DeepFilterFunction,
	EntryFilterFunction,
	ErrorFilterFunction
};
