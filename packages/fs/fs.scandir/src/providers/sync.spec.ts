import * as assert from 'assert';
import * as path from 'path';

import * as sinon from 'sinon';
import { Dirent, DirentType, Stats } from '@nodelib/fs.macchiato';

import Settings from '../settings';
import * as utils from '../utils';
import * as provider from './sync';

import type { Entry } from '../types';

describe('Providers → Sync', () => {
	describe('.read', () => {
		it('should return entries', () => {
			const dirent = new Dirent('file.txt', DirentType.File);

			const readdirSync = sinon.stub().returns([dirent]);

			const settings = new Settings({
				fs: { readdirSync },
			});

			const expected: Entry[] = [{
				name: 'file.txt',
				path: path.join('root', 'file.txt'),
				dirent,
			}];

			const actual = provider.read('root', settings);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return entries with the "stats" property', () => {
			const dirent = new Dirent('file.txt', DirentType.File);
			const stats = new Stats();

			const readdirSync = sinon.stub().returns([dirent]);
			const lstatSync = sinon.stub().returns(stats);

			const settings = new Settings({
				fs: { readdirSync, lstatSync },
				stats: true,
			});

			const expected: Entry[] = [{
				name: 'file.txt',
				path: path.join('root', 'file.txt'),
				dirent,
				stats,
			}];

			const actual = provider.read('root', settings);

			assert.deepStrictEqual(actual, expected);
		});

		it('should update Dirent when the "stats" and "followSymbolicLinks" options are enabled', () => {
			const dirent = new Dirent('file.txt', DirentType.Link);
			const stats = new Stats();

			const readdirSync = sinon.stub().returns([dirent]);
			const lstatSync = sinon.stub().returns(new Stats({ isSymbolicLink: true }));
			const statSync = sinon.stub().returns(stats);

			const settings = new Settings({
				fs: { readdirSync, lstatSync, statSync },
				stats: true,
				followSymbolicLinks: true,
			});

			const expected: Entry[] = [{
				name: 'file.txt',
				path: path.join('root', 'file.txt'),
				dirent: utils.fs.createDirentFromStats('file.txt', stats),
				stats,
			}];

			const actual = provider.read('root', settings);

			assert.deepStrictEqual(actual, expected);
		});

		it('should update Dirent when the "followSymbolicLinks" option is enabled', () => {
			const dirent = new Dirent('file.txt', DirentType.Link);
			const stats = new Stats();

			const readdirSync = sinon.stub().returns([dirent]);
			const statSync = sinon.stub().returns(stats);

			const settings = new Settings({
				fs: { readdirSync, statSync },
				followSymbolicLinks: true,
			});

			const expected: Entry[] = [{
				name: 'file.txt',
				path: path.join('root', 'file.txt'),
				dirent: utils.fs.createDirentFromStats('file.txt', stats),
			}];

			const actual = provider.read('root', settings);

			assert.deepStrictEqual(actual, expected);
		});

		it('should do nothing with symbolic links when the "followSymbolicLinks" option is disabled', () => {
			const dirent = new Dirent('file.txt', DirentType.Link);

			const readdirSync = sinon.stub().returns([dirent]);

			const settings = new Settings({
				fs: { readdirSync },
			});

			const expected: Entry[] = [{
				name: 'file.txt',
				path: path.join('root', 'file.txt'),
				dirent,
			}];

			const actual = provider.read('root', settings);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return lstat for broken symbolic link when the "throwErrorOnBrokenSymbolicLink" option is disabled', () => {
			const dirent = new Dirent('file.txt', DirentType.Link);

			const readdirSync = sinon.stub().returns([dirent]);
			const statSync = sinon.stub().throws(new Error('error'));

			const settings = new Settings({
				followSymbolicLinks: true,
				throwErrorOnBrokenSymbolicLink: false,
				fs: { readdirSync, statSync },
			});

			const expected: Entry[] = [{
				name: 'file.txt',
				path: path.join('root', 'file.txt'),
				dirent,
			}];

			const actual = provider.read('root', settings);

			assert.deepStrictEqual(actual, expected);
		});

		it('should throw an error for broken symbolic link when the "throwErrorOnBrokenSymbolicLink" option is enabled', () => {
			const dirent = new Dirent('file.txt', DirentType.Link);

			const readdirSync = sinon.stub().returns([dirent]);
			const statSync = sinon.stub().throws(new Error('error'));

			const settings = new Settings({
				followSymbolicLinks: true,
				throwErrorOnBrokenSymbolicLink: true,
				fs: { readdirSync, statSync },
			});

			const expectedErrorMessageRe = /Error: error/;

			assert.throws(() => provider.read('root', settings), expectedErrorMessageRe);
		});
	});
});
