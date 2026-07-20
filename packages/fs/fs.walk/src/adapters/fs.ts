import * as fsScandir from '@nodelib/fs.scandir';
import type { AsyncCallback, Settings, Entry } from '@nodelib/fs.scandir';

type ScandirAsynchronousMethod = (root: string, settings: Settings, callback: AsyncCallback) => void;
type ScandirSynchronousMethod = (root: string, settings: Settings) => Entry[];

export type FileSystemAdapterInterface = {
	scandir: ScandirAsynchronousMethod;
	scandirSync: ScandirSynchronousMethod;
};

export class FileSystemAdapter implements FileSystemAdapterInterface {
	public readonly scandir = fsScandir.scandir;
	public readonly scandirSync = fsScandir.scandirSync;
}
