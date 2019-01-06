import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

import rimraf = require('rimraf');

import * as pkg from './index';
import { DirEntry } from './types/entry';

describe('Package', () => {
	before(() => {
		rimraf.sync('fixtures');

		fs.mkdirSync('fixtures');
		fs.mkdirSync('fixtures/a');
		fs.writeFileSync('fixtures/b', 'content');
	});

	after(() => {
		rimraf.sync('fixtures');
	});

	describe('.scandir', () => {
		it('should return entries inside the specified path', async () => {
			const actual = await pkg.scandir('fixtures');

			const expected: DirEntry[] = [
				{
					name: 'a',
					path: path.join('fixtures', 'a'),
					ino: actual[0].ino,
					isDirectory: true, isFile: false, isSymlink: false
				},
				{
					name: 'b',
					path: path.join('fixtures', 'b'),
					ino: actual[1].ino,
					isDirectory: false, isFile: true, isSymlink: false
				}
			];

			assert.deepStrictEqual(actual, expected);
		});

		it('should return only one entry', async () => {
			const preFilter: pkg.PreFilterFunction = (name) => name === 'a';

			const actual = await pkg.scandir('fixtures', { preFilter });

			const expected: DirEntry[] = [
				{
					name: 'a',
					path: path.join('fixtures', 'a'),
					ino: actual[0].ino,
					isDirectory: true, isFile: false, isSymlink: false
				}
			];

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.scandirCallback', () => {
		it('should throw error when callback is not a function', () => {
			const expectedMessage = /TypeError: The "callback" argument must be of type Function./;

			/* tslint:disable-next-line: no-any */
			assert.throws(() => pkg.scandirCallback('fixtures/b', 'callback' as any), expectedMessage);
		});

		it('should return entries for the current directory', (done) => {
			pkg.scandirCallback('fixtures', (err, entries) => {
				if (err) {
					return done('An unexpected error was found.');
				}

				const expected: DirEntry[] = [
					{
						name: 'a',
						path: path.join('fixtures', 'a'),
						ino: (entries as DirEntry[])[0].ino,
						isDirectory: true, isFile: false, isSymlink: false
					},
					{
						name: 'b',
						path: path.join('fixtures', 'b'),
						ino: (entries as DirEntry[])[1].ino,
						isDirectory: false, isFile: true, isSymlink: false
					}
				];

				assert.strictEqual(err, null);
				assert.deepStrictEqual(entries, expected);
				done();
			});
		});

		it('should return only one entry', (done) => {
			const preFilter: pkg.PreFilterFunction = (name) => name === 'a';

			pkg.scandirCallback('fixtures', { preFilter }, (err, entries) => {
				if (err) {
					return done('An unexpected error was found.');
				}

				const expected: DirEntry[] = [
					{
						name: 'a',
						path: path.join('fixtures', 'a'),
						ino: (entries as DirEntry[])[0].ino,
						isDirectory: true, isFile: false, isSymlink: false
					}
				];

				assert.strictEqual(err, null);
				assert.deepStrictEqual(entries, expected);
				done();
			});
		});
	});

	describe('.scandirSync', () => {
		it('should return entries inside the specified path', () => {
			const actual = pkg.scandirSync('fixtures');

			const expected: DirEntry[] = [
				{
					name: 'a',
					path: path.join('fixtures', 'a'),
					ino: actual[0].ino,
					isDirectory: true, isFile: false, isSymlink: false
				},
				{
					name: 'b',
					path: path.join('fixtures', 'b'),
					ino: actual[1].ino,
					isDirectory: false, isFile: true, isSymlink: false
				}
			];

			assert.deepStrictEqual(actual, expected);
		});

		it('should return only one entry', () => {
			const preFilter: pkg.PreFilterFunction = (name) => name === 'a';

			const actual = pkg.scandirSync('fixtures', { preFilter });

			const expected: DirEntry[] = [
				{
					name: 'a',
					path: path.join('fixtures', 'a'),
					ino: actual[0].ino,
					isDirectory: true, isFile: false, isSymlink: false
				}
			];

			assert.deepStrictEqual(actual, expected);
		});
	});
});
