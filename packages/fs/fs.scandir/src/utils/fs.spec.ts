import * as assert from 'node:assert';

import { Stats } from '@nodelib/fs.macchiato';
import { describe, it } from 'mocha';

import * as util from './fs';

describe('Utils → FS', () => {
	describe('.createDirentFromStats', () => {
		it('should convert fs.Stats to fs.Dirent', () => {
			const actual = util.createDirentFromStats('name', new Stats(), 'directory');

			assert.strictEqual(actual.name, 'name');
			// The 'parentPath' was introduced in Node.js 18.20.
			// eslint-disable-next-line @typescript-eslint/no-deprecated
			assert.strictEqual(actual.parentPath || actual.path, 'directory');
			assert.ok(!actual.isBlockDevice());
			assert.ok(!actual.isCharacterDevice());
			assert.ok(!actual.isDirectory());
			assert.ok(!actual.isFIFO());
			assert.ok(!actual.isFile());
			assert.ok(!actual.isSocket());
			assert.ok(!actual.isSymbolicLink());
		});
	});
});
