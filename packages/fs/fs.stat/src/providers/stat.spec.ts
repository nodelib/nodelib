import * as assert from 'assert';
import * as fs from 'fs';

import { Stats } from '../../../fs.macchiato';

import * as optionsManager from '../managers/options';
import * as provider from './stat';

const SYMBOLIC_LINK_LSTAT = new Stats({ isSymbolicLink: true });
const SYMBOLIC_LINK_STAT = new Stats({ ino: 1 });
const FILE_LSTAT = new Stats();

describe('Providers → Stat', () => {
	describe('.sync', () => {
		it('should throw error for broken path', () => {
			const lstatSync: typeof fs.lstatSync = () => { throw new Error('lstat'); };

			const options = optionsManager.prepare({
				fs: { lstatSync }
			});

			assert.throws(() => provider.sync('broken_path', options), /^Error: lstat$/);
		});

		it('should throw error for broken symlink', () => {
			const lstatSync: typeof fs.lstatSync = () => SYMBOLIC_LINK_LSTAT;
			const statSync: typeof fs.statSync = () => { throw new Error('stat'); };

			const options = optionsManager.prepare({
				fs: { lstatSync, statSync }
			});

			assert.throws(() => provider.sync('broken_symlink', options), /^Error: stat$/);
		});

		it('should returns lstat for non-symlink entry', () => {
			const lstatSync: typeof fs.lstatSync = () => FILE_LSTAT;

			const options = optionsManager.prepare({
				fs: { lstatSync }
			});

			const expected = 0;

			const actual = provider.sync('non_symlink', options);

			assert.strictEqual(actual.ino, expected);
		});

		it('should returns stat for symlink entry', () => {
			const lstatSync: typeof fs.lstatSync = () => SYMBOLIC_LINK_LSTAT;
			const statSync: typeof fs.statSync = () => SYMBOLIC_LINK_STAT;

			const options = optionsManager.prepare({
				fs: { lstatSync, statSync }
			});

			const expected = 1;

			const actual = provider.sync('symlink', options);

			assert.strictEqual(actual.ino, expected);
		});

		it('should returns lstat for broken symlink entry when it possible', () => {
			const lstatSync: typeof fs.lstatSync = () => SYMBOLIC_LINK_LSTAT;
			const statSync: typeof fs.statSync = () => { throw new Error('stat'); };

			const options = optionsManager.prepare({
				throwErrorOnBrokenSymlinks: false,
				fs: { lstatSync, statSync }
			});

			const expected = 0;

			const actual = provider.sync('broken_symlink', options);

			assert.strictEqual(actual.ino, expected);
		});
	});

	describe('.async', () => {
		it('should throw error for broken path', (done) => {
			const lstat: typeof fs.lstat = ((_path, cb) => cb(new Error('lstat'), FILE_LSTAT)) as typeof fs.lstat;

			const options = optionsManager.prepare({
				fs: { lstat }
			});

			provider.async('broken_path', options, (err, stats) => {
				if (!err) {
					return done('Expected error not found.');
				}

				assert.strictEqual(err.message, 'lstat');
				assert.strictEqual(stats, undefined);
				done();
			});
		});

		it('should throw error for broken symlink', (done) => {
			/* tslint:disable-next-line: no-any */
			const lstat: typeof fs.lstat = ((_path, cb) => cb(null as any, SYMBOLIC_LINK_LSTAT)) as typeof fs.lstat;
			const stat: typeof fs.stat = ((_path, cb) => cb(new Error('stat'), FILE_LSTAT)) as typeof fs.stat;

			const options = optionsManager.prepare({
				fs: { lstat, stat }
			});

			provider.async('broken_symlink', options, (err, stats) => {
				if (!err) {
					return done('Expected error not found.');
				}

				assert.strictEqual(err.message, 'stat');
				assert.strictEqual(stats, undefined);
				done();
			});
		});

		it('should returns lstat for non-symlink entry', (done) => {
			/* tslint:disable-next-line: no-any */
			const lstat: typeof fs.lstat = ((_path, cb) => cb(null as any, FILE_LSTAT)) as typeof fs.lstat;

			const options = optionsManager.prepare({
				fs: { lstat }
			});

			provider.async('non_symlink', options, (err, stats) => {
				if (err) {
					return done('An unexpected error was found.');
				}

				const expected = 0;

				assert.strictEqual(err, null);
				assert.strictEqual((stats as fs.Stats).ino, expected);
				done();
			});
		});

		it('should returns stat for symlink entry', (done) => {
			/* tslint:disable-next-line: no-any */
			const lstat: typeof fs.lstat = ((_path, cb) => cb(null as any, SYMBOLIC_LINK_LSTAT)) as typeof fs.lstat;
			/* tslint:disable-next-line: no-any */
			const stat: typeof fs.stat = ((_path, cb) => cb(null as any, SYMBOLIC_LINK_STAT)) as typeof fs.stat;

			const options = optionsManager.prepare({
				fs: { lstat, stat }
			});

			provider.async('symlink', options, (err, stats) => {
				if (err) {
					return done('An unexpected error was found.');
				}

				const expected = 1;

				assert.strictEqual(err, null);
				assert.strictEqual((stats as fs.Stats).ino, expected);
				assert.ok((stats as fs.Stats).isSymbolicLink());
				done();
			});
		});

		it('should returns lstat for broken symlink entry when it possible', (done) => {
			/* tslint:disable-next-line: no-any */
			const lstat: typeof fs.lstat = ((_path, cb) => cb(null as any, SYMBOLIC_LINK_LSTAT)) as typeof fs.lstat;
			const stat: typeof fs.stat = ((_path, cb) => cb(new Error('stat'), FILE_LSTAT)) as typeof fs.stat;

			const options = optionsManager.prepare({
				throwErrorOnBrokenSymlinks: false,
				fs: { lstat, stat }
			});

			provider.async('broken_symlink', options, (err, stats) => {
				if (err) {
					return done('An unexpected error was found.');
				}

				const expected = 0;

				assert.strictEqual(err, null);
				assert.strictEqual((stats as fs.Stats).ino, expected);
				done();
			});
		});
	});

	describe('.isFollowedSymlink', () => {
		it('should returns true for followed symlink', () => {
			const options = optionsManager.prepare();

			const actual = provider.isFollowedSymlink(SYMBOLIC_LINK_LSTAT, options);

			assert.ok(actual);
		});

		it('should returns false for not symlink', () => {
			const options = optionsManager.prepare();

			const actual = provider.isFollowedSymlink(FILE_LSTAT, options);

			assert.ok(!actual);
		});

		it('should returns false for not followed symlink', () => {
			const options = optionsManager.prepare({ followSymlinks: false });

			const actual = provider.isFollowedSymlink(SYMBOLIC_LINK_LSTAT, options);

			assert.ok(!actual);
		});
	});
});
