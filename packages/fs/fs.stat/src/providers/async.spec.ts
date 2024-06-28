import * as assert from 'node:assert';

import * as sinon from 'sinon';
import { Stats, StatsMode } from '@nodelib/fs.macchiato';

import { Settings } from '../settings';
import * as provider from './async';

describe('Providers → Async', () => {
	describe('.read', () => {
		it('should return lstat for non-symlink entry', async () => {
			const lstat = sinon.stub<[string], Promise<Stats>>().resolves(new Stats());

			const settings = new Settings({
				fs: { lstat },
			});

			const stats = await provider.read('filepath', settings);
			assert.strictEqual(stats.ino, 0);
		});

		it('should return lstat for symlink entry when the "followSymbolicLink" option is disabled', async () => {
			const lstat = sinon.stub<[string], Promise<Stats>>().resolves(new Stats({ mode: StatsMode.Link }));

			const settings = new Settings({
				followSymbolicLink: false,
				fs: { lstat },
			});

			const stats = await provider.read('filepath', settings);
			assert.strictEqual(stats.ino, 0);
		});

		it('should return stat for symlink entry', async () => {
			const lstat = sinon.stub<[string], Promise<Stats>>().resolves(new Stats({ mode: StatsMode.Link }));
			const stat = sinon.stub<[string], Promise<Stats>>().resolves(new Stats({ ino: 1 }));

			const settings = new Settings({
				fs: { lstat, stat },
			});

			const stats = await provider.read('filepath', settings);
			assert.strictEqual(stats.ino, 1);
		});

		it('should return marked stat for symlink entry when the "markSymbolicLink" option is enabled', async () => {
			const lstat = sinon.stub<[string], Promise<Stats>>().resolves(new Stats({ mode: StatsMode.Link }));
			const stat = sinon.stub<[string], Promise<Stats>>().resolves(new Stats({ ino: 1 }));

			const settings = new Settings({
				fs: { lstat, stat },
				markSymbolicLink: true,
			});

			const stats = await provider.read('filepath', settings);
			assert.strictEqual(stats.isSymbolicLink(), true);
		});

		it('should return lstat for broken symlink entry when the "throwErrorOnBrokenSymbolicLink" option is disabled', async () => {
			const lstat = sinon.stub<[string], Promise<Stats>>().resolves(new Stats({ mode: StatsMode.Link }));
			const stat = sinon.stub<[string], Promise<Stats>>().rejects(new Error('error_message'));

			const settings = new Settings({
				fs: { lstat, stat },
				throwErrorOnBrokenSymbolicLink: false,
			});

			const stats = await provider.read('filepath', settings);
			assert.strictEqual(stats.ino, 0);
		});

		it('should throw an error when symlink entry is broken', async () => {
			const lstat = sinon.stub<[string], Promise<Stats>>().resolves(new Stats({ mode: StatsMode.Link }));
			const stat = sinon.stub<[string], Promise<Stats>>().rejects(new Error('broken'));

			const settings = new Settings({
				fs: { lstat, stat },
			});

			await assert.rejects(async () => {
				await provider.read('filepath', settings);
			}, (error) => {
				assert.strictEqual((error as Error | null)?.message, 'broken');
				return true;
			});
		});
	});
});
