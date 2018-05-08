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

			assert.deepEqual(actual, expected);
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

			assert.deepEqual(actual, expected);
		});
	});
});
