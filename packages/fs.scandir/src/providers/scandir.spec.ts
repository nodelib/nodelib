import * as assert from 'assert';
import * as fs from 'fs';

import * as tests from '../tests/index';

import * as optionsManager from '../managers/options';

import * as provider from './scandir';

import { DirEntry } from '../types/entry';

const DEFAULT_DIRECTORY_NAMES: string[] = ['.a', 'bbb', 'c', 'd', 'eeee', 'f'];

describe('Providers → Scandir', () => {
	describe('.sync', () => {
		it('should throw error for broken root path', () => {
			const readdirSync: typeof fs.readdirSync = () => { throw new Error('readdir'); };

			const options = optionsManager.prepare({
				fs: { readdirSync }
			});

			assert.throws(() => provider.sync('fake_path', options), /^Error: readdir/);
		});

		it('should throw error for broken entry', () => {
			const readdirSync: typeof fs.readdirSync = ((_path: fs.PathLike) => ['entry']) as typeof fs.readdirSync;
			const lstatSync: typeof fs.lstatSync = () => { throw new Error('lstat'); };

			const options = optionsManager.prepare({
				fs: { readdirSync, lstatSync }
			});

			assert.throws(() => provider.sync('fake_path', options), /^Error: lstat$/);
		});

		it('should returns array of entries', () => {
			const readdirSync: typeof fs.readdirSync = ((_path: fs.PathLike) => DEFAULT_DIRECTORY_NAMES) as typeof fs.readdirSync;
			const lstatSync: typeof fs.lstatSync = tests.getFakeStats;

			const options = optionsManager.prepare({
				fs: { readdirSync, lstatSync }
			});

			const expected: string[] = DEFAULT_DIRECTORY_NAMES;

			const entries = provider.sync('fake_path', options);
			const actual = entries.map((entry) => entry.name);

			assert.deepStrictEqual(actual, expected);
		});

		it('should returns array of entries with root directory', () => {
			const readdirSync: typeof fs.readdirSync = ((_path: fs.PathLike) => DEFAULT_DIRECTORY_NAMES) as typeof fs.readdirSync;
			const lstatSync: typeof fs.lstatSync = tests.getFakeStats;

			const options = optionsManager.prepare({
				fs: { readdirSync, lstatSync },
				includeRootDirectory: true
			});

			const expected: string[] = ['fake_path'].concat(DEFAULT_DIRECTORY_NAMES);

			const entries = provider.sync('fake_path', options);
			const actual = entries.map((entry) => entry.name);

			assert.deepStrictEqual(actual, expected);
		});

		it('should returns filtered array of entries by name and path', () => {
			const readdirSync: typeof fs.readdirSync = ((_path: fs.PathLike) => DEFAULT_DIRECTORY_NAMES) as typeof fs.readdirSync;
			const lstatSync: typeof fs.lstatSync = tests.getFakeStats;

			const options = optionsManager.prepare({
				fs: { readdirSync, lstatSync },
				preFilter: (name, path) => name.startsWith('.') && path.endsWith('.a')
			});

			const expected: string[] = ['.a'];

			const entries = provider.sync('fake_path', options);
			const actual = entries.map((entry) => entry.name);

			assert.deepStrictEqual(actual, expected);
		});

		it('should returns filtered array of entries by entry name', () => {
			const readdirSync: typeof fs.readdirSync = ((_path: fs.PathLike) => DEFAULT_DIRECTORY_NAMES) as typeof fs.readdirSync;
			const lstatSync: typeof fs.lstatSync = tests.getFakeStats;

			const options = optionsManager.prepare({
				fs: { readdirSync, lstatSync },
				filter: (entry) => entry.name.startsWith('.') && entry.path.endsWith('.a')
			});

			const expected: string[] = ['.a'];

			const entries = provider.sync('fake_path', options);
			const actual = entries.map((entry) => entry.name);

			assert.deepStrictEqual(actual, expected);
		});

		it('should returns sorted array of entries by name length', () => {
			const readdirSync: typeof fs.readdirSync = ((_path: fs.PathLike) => DEFAULT_DIRECTORY_NAMES) as typeof fs.readdirSync;
			const lstatSync: typeof fs.lstatSync = tests.getFakeStats;

			const options = optionsManager.prepare({
				fs: { readdirSync, lstatSync },
				sort: (a, b) => b.name.length - a.name.length
			});

			const expected: string[] = ['eeee', 'bbb', '.a', 'c', 'd', 'f'];

			const entries = provider.sync('fake_path', options);
			const actual = entries.map((entry) => entry.name);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.async', () => {
		it('should throw error for broken root path', (done) => {
			/* tslint:disable-next-line: no-any */
			const readdir: typeof fs.readdir = ((_path: fs.PathLike, cb: any) => cb(new Error('readdir'), undefined)) as typeof fs.readdir;

			const options = optionsManager.prepare({
				fs: { readdir }
			});

			provider.async('fake_path', options, (err, entries) => {
				if (!err) {
					return done('Expected error not found.');
				}

				assert.strictEqual(err.message, 'readdir');
				assert.strictEqual(entries, undefined);
				done();
			});
		});

		it('should throw error for broken entry', (done) => {
			/* tslint:disable-next-line: no-any */
			const readdir: typeof fs.readdir = ((_path: fs.PathLike, cb: any) => cb(null, ['entry'])) as typeof fs.readdir;
			const lstat: typeof fs.lstat = ((_path, cb) => cb(new Error('lstat'), {} as fs.Stats)) as typeof fs.lstat;

			const options = optionsManager.prepare({
				fs: { readdir, lstat }
			});

			provider.async('fake_path', options, (err, entries) => {
				if (!err) {
					return done('Expected error not found.');
				}

				assert.strictEqual(err.message, 'lstat');
				assert.strictEqual(entries, undefined);
				done();
			});
		});

		it('should returns array of entries', (done) => {
			/* tslint:disable-next-line: no-any */
			const readdir: typeof fs.readdir = ((_path: fs.PathLike, cb: any) => cb(null, DEFAULT_DIRECTORY_NAMES)) as typeof fs.readdir;
			/* tslint:disable-next-line: no-any */
			const lstat: typeof fs.lstat = ((_path, cb) => cb(null as any, tests.getFakeStats())) as typeof fs.lstat;

			const options = optionsManager.prepare({
				fs: { readdir, lstat }
			});

			const expected: string[] = DEFAULT_DIRECTORY_NAMES;

			provider.async('fake_path', options, (err, entries) => {
				if (err) {
					return done('An unexpected error was found.');
				}

				const actual = (entries as DirEntry[]).map((entry) => entry.name);

				assert.strictEqual(err, null);
				assert.deepStrictEqual(actual, expected);
				done();
			});
		});

		it('should returns array of entries with root directory', (done) => {
			/* tslint:disable-next-line: no-any */
			const readdir: typeof fs.readdir = ((_path: fs.PathLike, cb: any) => cb(null, DEFAULT_DIRECTORY_NAMES)) as typeof fs.readdir;
			/* tslint:disable-next-line: no-any */
			const lstat: typeof fs.lstat = ((_path, cb) => cb(null as any, tests.getFakeStats())) as typeof fs.lstat;

			const options = optionsManager.prepare({
				fs: { readdir, lstat },
				includeRootDirectory: true
			});

			const expected: string[] = ['fake_path'].concat(DEFAULT_DIRECTORY_NAMES);

			provider.async('fake_path', options, (err, entries) => {
				if (err) {
					return done('An unexpected error was found.');
				}

				const actual = (entries as DirEntry[]).map((entry) => entry.name);

				assert.strictEqual(err, null);
				assert.deepStrictEqual(actual, expected);
				done();
			});
		});

		it('should returns filtered array of entries by name', (done) => {
			/* tslint:disable-next-line: no-any */
			const readdir: typeof fs.readdir = ((_path: fs.PathLike, cb: any) => cb(null, DEFAULT_DIRECTORY_NAMES)) as typeof fs.readdir;
			/* tslint:disable-next-line: no-any */
			const lstat: typeof fs.lstat = ((_path, cb) => cb(null as any, tests.getFakeStats())) as typeof fs.lstat;

			const options = optionsManager.prepare({
				fs: { readdir, lstat },
				preFilter: (name, path) => name.startsWith('.') && path.endsWith('.a')
			});

			const expected: string[] = ['.a'];

			provider.async('fake_path', options, (err, entries) => {
				if (err) {
					return done('An unexpected error was found.');
				}

				const actual = (entries as DirEntry[]).map((entry) => entry.name);

				assert.strictEqual(err, null);
				assert.deepStrictEqual(actual, expected);
				done();
			});
		});

		it('should returns filtered array of entries by entry name', (done) => {
			/* tslint:disable-next-line: no-any */
			const readdir: typeof fs.readdir = ((_path: fs.PathLike, cb: any) => cb(null, DEFAULT_DIRECTORY_NAMES)) as typeof fs.readdir;
			/* tslint:disable-next-line: no-any */
			const lstat: typeof fs.lstat = ((_path, cb) => cb(null as any, tests.getFakeStats())) as typeof fs.lstat;

			const options = optionsManager.prepare({
				fs: { readdir, lstat },
				filter: (entry) => entry.name.startsWith('.') && entry.path.endsWith('.a')
			});

			const expected: string[] = ['.a'];

			provider.async('fake_path', options, (err, entries) => {
				if (err) {
					return done('An unexpected error was found.');
				}

				const actual = (entries as DirEntry[]).map((entry) => entry.name);

				assert.strictEqual(err, null);
				assert.deepStrictEqual(actual, expected);
				done();
			});
		});

		it('should returns sorted array of entries by name length', (done) => {
			/* tslint:disable-next-line: no-any */
			const readdir: typeof fs.readdir = ((_path: fs.PathLike, cb: any) => cb(null, DEFAULT_DIRECTORY_NAMES)) as typeof fs.readdir;
			/* tslint:disable-next-line: no-any */
			const lstat: typeof fs.lstat = ((_path, cb) => cb(null as any, tests.getFakeStats())) as typeof fs.lstat;

			const options = optionsManager.prepare({
				fs: { readdir, lstat },
				sort: (a, b) => b.name.length - a.name.length
			});

			const expected: string[] = ['eeee', 'bbb', '.a', 'c', 'd', 'f'];

			provider.async('fake_path', options, (err, entries) => {
				if (err) {
					return done('An unexpected error was found.');
				}

				const actual = (entries as DirEntry[]).map((entry) => entry.name);

				assert.strictEqual(err, null);
				assert.deepStrictEqual(actual, expected);
				done();
			});
		});
	});

	describe('.makeDirEntry', () => {
		it('should returns DirEntry', () => {
			const options = optionsManager.prepare();
			const stats = tests.getFakeStats();

			const expected: DirEntry = {
				name: 'name',
				path: 'root/name',
				ino: 0,
				isDirectory: false,
				isFile: true,
				isSymlink: false
			};

			const actual = provider.makeDirEntry('name', 'root/name', stats, options);

			assert.deepStrictEqual(actual, expected);
		});

		it('should returns DirEntry with fs.Stats', () => {
			const options = optionsManager.prepare({ stats: true });
			const stats = tests.getFakeStats();

			const expected = 0;

			const actual = provider.makeDirEntry('name', 'root/name', stats, options);

			assert.strictEqual(actual.stats!.ino, expected); /* tslint:disable-line no-non-null-assertion */
		});
	});
});
