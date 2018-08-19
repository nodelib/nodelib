import * as assert from 'assert';

import Client from './client';

import Group from './group';
import Hook, { NSHook } from './hook';
import Race from './race';

const noop = () => undefined;

describe('Client', () => {
	describe('Constructor', () => {
		it('should return a instance of class', () => {
			const client = new Client();

			assert.ok(client instanceof Client);
		});
	});

	describe('.suite', () => {
		it('should throw an error when settings is incomplete', () => {
			const client = new Client();

			assert.throws(() => client.suite('title', [], {}), /RangeError: The settings object is incomplete.+/);
		});

		it('should return a group', () => {
			const client = new Client();

			const epxected = 'title';

			const actual = client.suite('title', [], {
				warmupCount: 1,
				launchCount: 1,
				iterationCount: 1,
				parallel: 1
			});

			assert.strictEqual(actual.title, epxected);
		});
	});

	describe('.group', () => {
		it('should return a group class instance', () => {
			const client = new Client();

			const expected = new Group('title', []);

			const actual = client.group('title', []);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.race', () => {
		it('should return a race class instance', () => {
			const client = new Client();

			const expected = new Race('title', noop);

			const actual = client.race('title', noop);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.before', () => {
		it('should return a hook class instance', () => {
			const client = new Client();

			const expected = new Hook(NSHook.Type.Before, noop);

			const actual = client.before(noop);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.beforeIteration', () => {
		it('should return a hook class instance', () => {
			const client = new Client();

			const expected = new Hook(NSHook.Type.BeforeIteration, noop);

			const actual = client.beforeIteration(noop);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.beforeEach', () => {
		it('should return a hook class instance', () => {
			const client = new Client();

			const expected = new Hook(NSHook.Type.BeforeEach, noop);

			const actual = client.beforeEach(noop);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.beforeEachIteration', () => {
		it('should return a hook class instance', () => {
			const client = new Client();

			const expected = new Hook(NSHook.Type.BeforeEachIteration, noop);

			const actual = client.beforeEachIteration(noop);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.after', () => {
		it('should return a hook class instance', () => {
			const client = new Client();

			const expected = new Hook(NSHook.Type.After, noop);

			const actual = client.after(noop);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.afterIteration', () => {
		it('should return a hook class instance', () => {
			const client = new Client();

			const expected = new Hook(NSHook.Type.AfterIteration, noop);

			const actual = client.afterIteration(noop);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.afterEach', () => {
		it('should return a hook class instance', () => {
			const client = new Client();

			const expected = new Hook(NSHook.Type.AfterEach, noop);

			const actual = client.afterEach(noop);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.afterEachIteration', () => {
		it('should return a hook class instance', () => {
			const client = new Client();

			const expected = new Hook(NSHook.Type.AfterEachIteration, noop);

			const actual = client.afterEachIteration(noop);

			assert.deepStrictEqual(actual, expected);
		});
	});
});
