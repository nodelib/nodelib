import * as assert from 'assert';

import * as pkg from './index';

describe('Package', () => {
	it('should create a fake instance of fs.Stats', () => {
		const actual = new pkg.Stats();

		assert.ok(actual instanceof pkg.Stats);
	});

	it('should create a fake instance of fs.Dirent', () => {
		const actual = new pkg.Dirent();

		assert.ok(actual instanceof pkg.Dirent);
	});
});
