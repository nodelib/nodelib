import * as assert from 'assert';

import Stats from './stats';

const uid = process.platform === 'win32' ? undefined : process.getuid();
const gid = process.platform === 'win32' ? undefined : process.getgid();

describe('Stats', () => {
	it('should create a fake instance without options', () => {
		const stats = new Stats();

		const date = stats._date;

		assert.strictEqual(stats.dev, 0);
		assert.strictEqual(stats.ino, 0);
		assert.strictEqual(stats.mode, 0);
		assert.strictEqual(stats.nlink, 0);
		assert.strictEqual(stats.uid, uid);
		assert.strictEqual(stats.gid, gid);
		assert.strictEqual(stats.rdev, 0);
		assert.strictEqual(stats.size, 0);
		assert.strictEqual(stats.blksize, 0);
		assert.strictEqual(stats.blocks, 0);
		assert.strictEqual(stats.atimeMs, date.getTime());
		assert.strictEqual(stats.mtimeMs, date.getTime());
		assert.strictEqual(stats.ctimeMs, date.getTime());
		assert.strictEqual(stats.birthtimeMs, date.getTime());
		assert.strictEqual(stats.atime, date);
		assert.strictEqual(stats.mtime, date);
		assert.strictEqual(stats.ctime, date);
		assert.strictEqual(stats.birthtime, date);
		assert.ok(stats.isFile());
		assert.ok(!stats.isDirectory());
		assert.ok(!stats.isSymbolicLink());
		assert.ok(!stats.isBlockDevice());
		assert.ok(!stats.isCharacterDevice());
		assert.ok(!stats.isFIFO());
		assert.ok(!stats.isSocket());
	});

	it('should create a fake instance with empty options', () => {
		const stats = new Stats();

		const date = stats._date;

		assert.strictEqual(stats.dev, 0);
		assert.strictEqual(stats.ino, 0);
		assert.strictEqual(stats.mode, 0);
		assert.strictEqual(stats.nlink, 0);
		assert.strictEqual(stats.uid, uid);
		assert.strictEqual(stats.gid, gid);
		assert.strictEqual(stats.rdev, 0);
		assert.strictEqual(stats.size, 0);
		assert.strictEqual(stats.blksize, 0);
		assert.strictEqual(stats.blocks, 0);
		assert.strictEqual(stats.atimeMs, date.getTime());
		assert.strictEqual(stats.mtimeMs, date.getTime());
		assert.strictEqual(stats.ctimeMs, date.getTime());
		assert.strictEqual(stats.birthtimeMs, date.getTime());
		assert.strictEqual(stats.atime, date);
		assert.strictEqual(stats.mtime, date);
		assert.strictEqual(stats.ctime, date);
		assert.strictEqual(stats.birthtime, date);
		assert.ok(stats.isFile());
		assert.ok(!stats.isDirectory());
		assert.ok(!stats.isSymbolicLink());
		assert.ok(!stats.isBlockDevice());
		assert.ok(!stats.isCharacterDevice());
		assert.ok(!stats.isFIFO());
		assert.ok(!stats.isSocket());
	});

	it('should create a fake instance with options', () => {
		const date = new Date();

		const stats = new Stats({
			dev: 1,
			ino: 1,
			mode: 1,
			nlink: 1,
			uid: 1,
			gid: 1,
			rdev: 1,
			size: 1,
			blksize: 1,
			blocks: 1,
			atimeMs: date.getTime(),
			mtimeMs: date.getTime(),
			ctimeMs: date.getTime(),
			birthtimeMs: date.getTime(),
			atime: date,
			mtime: date,
			ctime: date,
			birthtime: date,
			isDirectory: true,
			isFile: false,
			isSymbolicLink: true,
			isBlockDevice: true,
			isCharacterDevice: true,
			isFIFO: true,
			isSocket: true,
		});

		assert.strictEqual(stats.dev, 1);
		assert.strictEqual(stats.ino, 1);
		assert.strictEqual(stats.mode, 1);
		assert.strictEqual(stats.nlink, 1);
		assert.strictEqual(stats.uid, 1);
		assert.strictEqual(stats.gid, 1);
		assert.strictEqual(stats.rdev, 1);
		assert.strictEqual(stats.size, 1);
		assert.strictEqual(stats.blksize, 1);
		assert.strictEqual(stats.blocks, 1);
		assert.strictEqual(stats.atimeMs, date.getTime());
		assert.strictEqual(stats.mtimeMs, date.getTime());
		assert.strictEqual(stats.ctimeMs, date.getTime());
		assert.strictEqual(stats.birthtimeMs, date.getTime());
		assert.strictEqual(stats.atime, date);
		assert.strictEqual(stats.mtime, date);
		assert.strictEqual(stats.ctime, date);
		assert.strictEqual(stats.birthtime, date);
		assert.ok(!stats.isFile());
		assert.ok(stats.isDirectory());
		assert.ok(stats.isSymbolicLink());
		assert.ok(stats.isBlockDevice());
		assert.ok(stats.isCharacterDevice());
		assert.ok(stats.isFIFO());
		assert.ok(stats.isSocket());
	});

	it('should create a fake instance with undefined as values', () => {
		const stats = new Stats({
			uid: undefined,
		});

		assert.strictEqual(stats.uid, undefined);
	});
});
