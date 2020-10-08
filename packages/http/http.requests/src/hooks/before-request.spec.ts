import * as assert from 'assert';
import * as url from 'url';

import * as tests from '../tests';
import * as hook from './before-request';

describe('hooks → before-request', () => {
	describe('.create', () => {
		it('should call logger', async () => {
			const logger = tests.makeLogger();
			const options = tests.makeNormalizedOptions({
				searchParams: new url.URLSearchParams({ token: '<value>' }),
				json: { message: '<value>' },
				context: tests.makeContext({
					logger,
					options: tests.makeOptionsContext({
						showQueryFields: true,
						showPayloadFields: true
					})
				})
			});

			await hook.create()(options);

			assert.deepStrictEqual(logger.logRequest.firstCall.args, [{
				type: 'request',
				id: '<request>',
				method: 'GET',
				url: options.url,
				info: {
					query: { token: '<value>' },
					payload: { message: '<value>' }
				}
			}]);
		});
	});

	describe('.getQueryFields', () => {
		it('should return an empty object when the `showQueryFields` is disabled', () => {
			const parameters = new url.URLSearchParams();
			const options = tests.makeOptionsContext({ showQueryFields: false });

			const expected = {};

			const actual = hook.getQueryFields(parameters, options);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return an object with all parameters when the `showQueryFields` is enabled', () => {
			const parameters = new url.URLSearchParams({ token: '<value>' });
			const options = tests.makeOptionsContext({ showQueryFields: true });

			const expected = { token: '<value>' };

			const actual = hook.getQueryFields(parameters, options);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return an object with specified parameters', () => {
			const parameters = new url.URLSearchParams({ token: '<value>', author: '<value>' });
			const options = tests.makeOptionsContext({ showQueryFields: ['token'] });

			const expected = { token: '<value>' };

			const actual = hook.getQueryFields(parameters, options);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return an object without rejected fields', () => {
			const parameters = new url.URLSearchParams({ token: '<value>', author: '<value>' });
			const options = tests.makeOptionsContext({ showQueryFields: true, hideQueryFields: ['token'] });

			const expected = { author: '<value>' };

			const actual = hook.getQueryFields(parameters, options);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.getPayloadFields', () => {
		it('should return an empty object when the payload is an undefined', () => {
			const options = tests.makeOptionsContext({ showPayloadFields: true });

			const expected = {};

			const actual = hook.getPayloadFields(undefined, options);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return an empty object when the `showPayloadFields` is disabled', () => {
			const payload = { token: '<value>' };
			const options = tests.makeOptionsContext({ showPayloadFields: false });

			const expected = {};

			const actual = hook.getPayloadFields(payload, options);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return an object with all fields when the `showPayloadFields` is enabled', () => {
			const payload = { token: '<value>' };

			const options = tests.makeOptionsContext({ showPayloadFields: true });

			const expected = { token: '<value>' };

			const actual = hook.getPayloadFields(payload, options);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return an object with specified parameters', () => {
			const payload = { token: '<value>', author: '<value>' };
			const options = tests.makeOptionsContext({ showPayloadFields: ['token'] });

			const expected = { token: '<value>' };

			const actual = hook.getPayloadFields(payload, options);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return an object without rejected fields', () => {
			const payload = { token: '<value>', author: '<value>' };
			const options = tests.makeOptionsContext({ showPayloadFields: true, hidePayloadFields: ['token'] });

			const expected = { author: '<value>' };

			const actual = hook.getPayloadFields(payload, options);

			assert.deepStrictEqual(actual, expected);
		});
	});
});
