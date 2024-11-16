import * as assert from 'node:assert';
import * as path from 'node:path';
import * as util from 'node:util';

import * as sinon from 'sinon';
import { Dirent, DirentType, Stats, StatsMode } from '@nodelib/fs.macchiato';
import { describe, it } from 'mocha';

import { Settings } from '../settings';
import * as utils from '../utils';
import * as provider from './async';

import type { Entry } from '../types';

const read = util.promisify(provider.read);

describe('Providers → Async', () => {
	describe('.read', () => {
		it('should return entries', async () => {
			const dirent = new Dirent('file.txt', DirentType.File);

			const readdir = sinon.stub().yields(null, [dirent]);

			const settings = new Settings({
				fs: { readdir },
			});

			const expected: Entry[] = [{
				name: 'file.txt',
				path: path.join('root', 'file.txt'),
				dirent,
			}];

			const actual = await read('root', settings);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return entries with the "stats" property', async () => {
			const dirent = new Dirent('file.txt', DirentType.File);
			const stats = new Stats();

			const readdir = sinon.stub().yields(null, [dirent]);
			const lstat = sinon.stub().yields(null, stats);

			const settings = new Settings({
				fs: { readdir, lstat },
				stats: true,
			});

			const expected: Entry[] = [{
				name: 'file.txt',
				path: path.join('root', 'file.txt'),
				dirent,
				stats,
			}];

			const actual = await read('root', settings);

			assert.deepStrictEqual(actual, expected);
		});

		it('should update Dirent when the "stats" and "followSymbolicLinks" options are enabled', async () => {
			const dirent = new Dirent('file.txt', DirentType.Link);
			const stats = new Stats();

			const readdir = sinon.stub().yields(null, [dirent]);
			const lstat = sinon.stub().yields(null, new Stats({ mode: StatsMode.Link }));
			const stat = sinon.stub().yields(null, stats);

			const settings = new Settings({
				fs: { readdir, lstat, stat },
				stats: true,
				followSymbolicLinks: true,
			});

			const expected: Entry[] = [{
				name: 'file.txt',
				path: path.join('root', 'file.txt'),
				dirent: utils.fs.createDirentFromStats('file.txt', stats),
				stats,
			}];

			const actual = await read('root', settings);

			assert.deepStrictEqual(actual, expected);
		});

		it('should update Dirent when the "followSymbolicLinks" option is enabled', async () => {
			const dirent = new Dirent('file.txt', DirentType.Link);
			const stats = new Stats();

			const readdir = sinon.stub().yields(null, [dirent]);
			const stat = sinon.stub().yields(null, stats);

			const settings = new Settings({
				fs: { readdir, stat },
				followSymbolicLinks: true,
			});

			const expected: Entry[] = [{
				name: 'file.txt',
				path: path.join('root', 'file.txt'),
				dirent: utils.fs.createDirentFromStats('file.txt', stats),
			}];

			const actual = await read('root', settings);

			assert.deepStrictEqual(actual, expected);
		});

		it('should do nothing with symbolic links when the "followSymbolicLinks" option is disabled', async () => {
			const dirent = new Dirent('file.txt', DirentType.Link);

			const readdir = sinon.stub().yields(null, [dirent]);

			const settings = new Settings({
				fs: { readdir },
			});

			const expected: Entry[] = [{
				name: 'file.txt',
				path: path.join('root', 'file.txt'),
				dirent,
			}];

			const actual = await read('root', settings);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return lstat for broken symbolic link when the "throwErrorOnBrokenSymbolicLink" option is disabled', async () => {
			const dirent = new Dirent('file.txt', DirentType.Link);

			const readdir = sinon.stub().yields(null, [dirent]);
			const stat = sinon.stub().yields(new Error('error'));

			const settings = new Settings({
				followSymbolicLinks: true,
				throwErrorOnBrokenSymbolicLink: false,
				fs: { readdir, stat },
			});

			const expected: Entry[] = [{
				name: 'file.txt',
				path: path.join('root', 'file.txt'),
				dirent,
			}];

			const actual = await read('root', settings);

			assert.deepStrictEqual(actual, expected);
		});

		it('should throw an error for broken symbolic link when the "throwErrorOnBrokenSymbolicLink" option is enabled', async () => {
			const dirent = new Dirent('file.txt', DirentType.Link);

			const readdir = sinon.stub().yields(null, [dirent]);
			const stat = sinon.stub().yields(new Error('error'));

			const settings = new Settings({
				followSymbolicLinks: true,
				throwErrorOnBrokenSymbolicLink: true,
				fs: { readdir, stat },
			});

			const expectedErrorMessageRe = /Error: error/;

			await assert.rejects(read('root', settings), expectedErrorMessageRe);
		});
	});
});
