import * as assert from 'node:assert';
import * as fs from 'node:fs';

import { describe, it } from 'mocha';

import { Dirent, Stats } from '.';

describe('Package', () => {
	it('should create a fake instance of fs.Stats', () => {
		const actual = new Stats();

		assert.ok(actual instanceof fs.Stats);
	});

	it('should create a fake instance of fs.Dirent', () => {
		const actual = new Dirent();

		assert.ok(actual instanceof Dirent);
	});
});
