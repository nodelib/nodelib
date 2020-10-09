import * as assert from 'assert';
import * as url from 'url';

import * as tests from '../tests';
import * as hook from './before-request';

describe('hooks → before-request', () => {
	describe('.getQueryFields', () => {
		it('should return an undefined when the `showQueryFields` is disabled', () => {
			const parameters = new url.URLSearchParams();
			const options = tests.makeOptionsContext({ showQueryFields: false });

			const actual = hook.getQueryFields(parameters, options);

			assert.strictEqual(actual, undefined);
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
		it('should return an undefined when the payload is an undefined', () => {
			const options = tests.makeOptionsContext({ showPayloadFields: true });

			const actual = hook.getPayloadFields(undefined, options);

			assert.strictEqual(actual, undefined);
		});

		it('should return an undefined when the `showPayloadFields` is disabled', () => {
			const payload = { token: '<value>' };
			const options = tests.makeOptionsContext({ showPayloadFields: false });

			const actual = hook.getPayloadFields(payload, options);

			assert.strictEqual(actual, undefined);
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
