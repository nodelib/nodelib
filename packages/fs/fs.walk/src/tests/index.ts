import * as sinon from 'sinon';
import { Dirent, DirentType } from '@nodelib/fs.macchiato';

import type { Entry, ErrnoException } from '../types';

export function buildFakeFileEntry(entry?: Partial<Entry>): Entry {
	return {
		name: 'fake.txt',
		path: 'directory/fake.txt',
		dirent: new Dirent('fake.txt', DirentType.File),
		...entry,
	};
}

export function buildFakeDirectoryEntry(entry?: Partial<Entry>): Entry {
	return {
		name: 'fake',
		path: 'directory/fake',
		dirent: new Dirent('fake', DirentType.Directory),
		...entry,
	};
}

export const EPERM_ERRNO: ErrnoException = {
	name: 'EPERM',
	code: 'EPERM',
	message: 'EPERM',
};

export class TestAsyncReader {
	public read: sinon.SinonStub = sinon.stub();
	public destroy: sinon.SinonStub = sinon.stub();
	public onError: sinon.SinonStub = sinon.stub();
	public onEntry: sinon.SinonStub = sinon.stub();
	public onEnd: sinon.SinonStub = sinon.stub();
	public isDestroyed: boolean = false;
}

export class TestSyncReader {
	public read: sinon.SinonStub = sinon.stub();
}

export class TestFileSystemAdapter {
	public scandir = sinon.stub();
	public scandirSync = sinon.stub();
}
