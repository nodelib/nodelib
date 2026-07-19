import * as assert from 'node:assert';

import { describe, it } from 'mocha';

import * as common from './common';

describe('Readers → Common', () => {
	describe('.getPathPrefix', () => {
		it('should append the separator only when it is missing', () => {
			const windowsPath = String.raw`C:\Users`;

			assert.strictEqual(common.getPathPrefix('.', '/'), './');
			assert.strictEqual(common.getPathPrefix('directory', '/'), 'directory/');
			assert.strictEqual(common.getPathPrefix(windowsPath, '\\'), `${windowsPath}\\`);
		});

		it('should preserve paths that already end with the separator', () => {
			// Unix
			assert.strictEqual(common.getPathPrefix('/', '/'), '/');
			assert.strictEqual(common.getPathPrefix('//', '/'), '//');
			assert.strictEqual(common.getPathPrefix('/directory/', '/'), '/directory/');

			// Windows
			assert.strictEqual(common.getPathPrefix('C:/', '/'), 'C:/');
			assert.strictEqual(common.getPathPrefix('C:\\', '\\'), 'C:\\');
			assert.strictEqual(common.getPathPrefix('//?/C:/', '/'), '//?/C:/');
			assert.strictEqual(common.getPathPrefix('\\\\?\\C:\\', '\\'), '\\\\?\\C:\\');
		});
	});
});
