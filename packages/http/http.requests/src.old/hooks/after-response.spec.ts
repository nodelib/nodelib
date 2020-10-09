import * as assert from 'assert';

import * as tests from '../tests';
import * as hook from './after-response';

describe('hooks → after-response', () => {
	describe('.extractBody', () => {
		it('should return an undefined when the body is not a string', () => {
			const response = tests.makeResponse({ body: undefined });

			const actual = hook.extractBody(response, 100);

			assert.strictEqual(actual, undefined);
		});

		it('should return an original body', () => {
			const response = tests.makeResponse({ body: '<value>' });

			const actual = hook.extractBody(response, 100);

			assert.strictEqual(actual, '<value>');
		});

		it('should return a truncated body', () => {
			const response = tests.makeResponse({ body: 'Some long text' });

			const actual = hook.extractBody(response, 12);

			assert.strictEqual(actual, 'Some long te<truncated>');
		});
	});
});
