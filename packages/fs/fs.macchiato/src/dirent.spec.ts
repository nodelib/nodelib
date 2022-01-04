import * as assert from 'assert';
import * as fs from 'fs';

import Dirent from './dirent';

describe('Dirent', () => {
	it('should be instance of fs.Dirent', () => {
		const dirent = new Dirent();

		assert.ok(dirent instanceof fs.Dirent);
	});

	it('should create a fake instance without options', () => {
		const dirent = new Dirent();

		assert.strictEqual(dirent.name, 'unknown.txt');
		assert.ok(!dirent.isFile());
		assert.ok(!dirent.isDirectory());
		assert.ok(!dirent.isSymbolicLink());
		assert.ok(!dirent.isBlockDevice());
		assert.ok(!dirent.isCharacterDevice());
		assert.ok(!dirent.isFIFO());
		assert.ok(!dirent.isSocket());
	});

	it('should create a fake instance with empty options', () => {
		const dirent = new Dirent({});

		assert.strictEqual(dirent.name, 'unknown.txt');
		assert.ok(!dirent.isFile());
		assert.ok(!dirent.isDirectory());
		assert.ok(!dirent.isSymbolicLink());
		assert.ok(!dirent.isBlockDevice());
		assert.ok(!dirent.isCharacterDevice());
		assert.ok(!dirent.isFIFO());
		assert.ok(!dirent.isSocket());
	});

	it('should create a fake instance with options', () => {
		const dirent = new Dirent({
			name: 'known.txt',
			isDirectory: true,
			isFile: true,
			isSymbolicLink: true,
			isBlockDevice: true,
			isCharacterDevice: true,
			isFIFO: true,
			isSocket: true,
		});

		assert.strictEqual(dirent.name, 'known.txt');
		assert.ok(dirent.isFile());
		assert.ok(dirent.isDirectory());
		assert.ok(dirent.isSymbolicLink());
		assert.ok(dirent.isBlockDevice());
		assert.ok(dirent.isCharacterDevice());
		assert.ok(dirent.isFIFO());
		assert.ok(dirent.isSocket());
	});
});
