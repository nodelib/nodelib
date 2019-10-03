import { Readable } from 'stream';

import { Dirent, FileSystemAdapter } from '@nodelib/fs.scandir';

import AsyncProvider, { AsyncCallback } from './providers/async';
import StreamProvider from './providers/stream';
import SyncProvider from './providers/sync';
import Settings, { DeepFilterFunction, EntryFilterFunction, ErrorFilterFunction, Options } from './settings';
import { Entry } from './types';

function walk(dir: string, callback: AsyncCallback): void;
function walk(dir: string, optionsOrSettings: Options | Settings, callback: AsyncCallback): void;
function walk(dir: string, optionsOrSettingsOrCallback: Options | Settings | AsyncCallback, callback?: AsyncCallback): void {
	if (typeof optionsOrSettingsOrCallback === 'function') {
		return new AsyncProvider(dir, getSettings()).read(optionsOrSettingsOrCallback);
	}

	new AsyncProvider(dir, getSettings(optionsOrSettingsOrCallback)).read(callback as AsyncCallback);
}

// https://github.com/typescript-eslint/typescript-eslint/issues/60
// eslint-disable-next-line no-redeclare
declare namespace walk {
	function __promisify__(dir: string, optionsOrSettings?: Options | Settings): Promise<Entry[]>;
}

function walkSync(dir: string, optionsOrSettings?: Options | Settings): Entry[] {
	const settings = getSettings(optionsOrSettings);
	const provider = new SyncProvider(dir, settings);

	return provider.read();
}

function walkStream(dir: string, optionsOrSettings?: Options | Settings): Readable {
	const settings = getSettings(optionsOrSettings);
	const provider = new StreamProvider(dir, settings);

	return provider.read();
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
