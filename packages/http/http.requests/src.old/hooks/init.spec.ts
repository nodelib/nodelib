import * as assert from 'assert';

import * as sinon from 'sinon';

import * as tests from '../tests';
import Logger from '../logger';
import * as hook from './init';

describe('hooks → init', () => {
	describe('.buildContext', () => {
		it('should return built context with user values', () => {
			const logger = new Logger();

			const expected = tests.makeContext({
				logger,
				options: tests.makeOptionsContext({
					showQueryFields: false
				})
			});

			const actual = hook.buildContext({
				logger,
				request: {
					id: '<request>'
				}
			});

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.getRequestId', () => {
		it('should return a random request id', () => {
			const actual = hook.getRequestId();

			sinon.assert.match(actual, sinon.match.string);
		});

		it('should retrun a request id from the headers', () => {
			const actual = hook.getRequestId({ 'x-request-id': '<request>' });

			assert.strictEqual(actual, '<request>');
		});
	});
});
