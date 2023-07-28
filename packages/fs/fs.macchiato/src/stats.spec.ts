import * as assert from 'node:assert';
import * as fs from 'node:fs';

import * as sinon from 'sinon';

import { Stats, StatsMode } from './stats';

const isWindows = process.platform === 'win32';

const uid = isWindows ? undefined : process.getuid();
const gid = isWindows ? undefined : process.getgid();

const FAKE_DATE = new Date();

describe('Stats', () => {
	let sandbox: sinon.SinonSandbox;

	before(() => {
		sandbox = sinon.createSandbox();

		sandbox.useFakeTimers({ now: FAKE_DATE });
	});

	after(() => {
		sandbox.reset();
	});

	it('should be instance of fs.Stats', () => {
		const stats = new Stats();

		assert.ok(stats instanceof fs.Stats);
	});

	it('should create a fake instance without options', () => {
		const stats = new Stats();

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
		assert.strictEqual(stats.atimeMs, FAKE_DATE.getTime());
		assert.strictEqual(stats.mtimeMs, FAKE_DATE.getTime());
		assert.strictEqual(stats.ctimeMs, FAKE_DATE.getTime());
		assert.strictEqual(stats.birthtimeMs, FAKE_DATE.getTime());
		assert.deepStrictEqual(stats.atime, FAKE_DATE);
		assert.deepStrictEqual(stats.mtime, FAKE_DATE);
		assert.deepStrictEqual(stats.ctime, FAKE_DATE);
		assert.deepStrictEqual(stats.birthtime, FAKE_DATE);
		assert.ok(!stats.isFile());
		assert.ok(!stats.isDirectory());
		assert.ok(!stats.isSymbolicLink());
		assert.ok(!stats.isBlockDevice());
		assert.ok(!stats.isCharacterDevice());
		assert.ok(!stats.isFIFO());
		assert.ok(!stats.isSocket());
	});

	it('should create a fake instance with empty options', () => {
		const stats = new Stats();

		assert.strictEqual(stats.dev, 0);
		assert.strictEqual(stats.ino, 0);
		assert.strictEqual(stats.mode, StatsMode.Unknown);
		assert.strictEqual(stats.nlink, 0);
		assert.strictEqual(stats.uid, uid);
		assert.strictEqual(stats.gid, gid);
		assert.strictEqual(stats.rdev, 0);
		assert.strictEqual(stats.size, 0);
		assert.strictEqual(stats.blksize, 0);
		assert.strictEqual(stats.blocks, 0);
		assert.strictEqual(stats.atimeMs, FAKE_DATE.getTime());
		assert.strictEqual(stats.mtimeMs, FAKE_DATE.getTime());
		assert.strictEqual(stats.ctimeMs, FAKE_DATE.getTime());
		assert.strictEqual(stats.birthtimeMs, FAKE_DATE.getTime());
		assert.deepStrictEqual(stats.atime, FAKE_DATE);
		assert.deepStrictEqual(stats.mtime, FAKE_DATE);
		assert.deepStrictEqual(stats.ctime, FAKE_DATE);
		assert.deepStrictEqual(stats.birthtime, FAKE_DATE);
		assert.ok(!stats.isFile());
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
			mode: StatsMode.Directory,
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
		});

		assert.strictEqual(stats.dev, 1);
		assert.strictEqual(stats.ino, 1);
		assert.strictEqual(stats.mode, StatsMode.Directory);
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
		assert.deepStrictEqual(stats.atime, date);
		assert.deepStrictEqual(stats.mtime, date);
		assert.deepStrictEqual(stats.ctime, date);
		assert.deepStrictEqual(stats.birthtime, date);
		assert.ok(!stats.isFile());
		assert.ok(stats.isDirectory());
		assert.ok(!stats.isSymbolicLink());
		assert.ok(!stats.isBlockDevice());
		assert.ok(!stats.isCharacterDevice());
		assert.ok(!stats.isFIFO());
		assert.ok(!stats.isSocket());
	});

	it('should create a fake instance with undefined as values', () => {
		const stats = new Stats({
			uid: undefined,
			gid: undefined,
		});

		assert.strictEqual(stats.uid, undefined);
		assert.strictEqual(stats.gid, undefined);
	});
});
