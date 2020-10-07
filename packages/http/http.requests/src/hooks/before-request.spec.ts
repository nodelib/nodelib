import * as assert from 'assert';
import * as url from 'url';

import { OptionsContext } from '../types';
import * as hook from './before-request';

function makeOptionsContext(context: Partial<OptionsContext> = {}): OptionsContext {
	return {
		truncateResponseBodyAfter: 10,
		showQueryFields: false,
		hideQueryFields: [],
		showPayloadFields: false,
		hidePayloadFields: [],
		...context
	};
}

describe('hooks → before-request', () => {
	describe('.getQueryFields', () => {
		it('should return an empty object when the `showQueryFields` is disabled', () => {
			const parameters = new url.URLSearchParams();
			const options = makeOptionsContext({ showQueryFields: false });

			const expected = {};

			const actual = hook.getQueryFields(parameters, options);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return an object with all parameters when the `showQueryFields` is enabled', () => {
			const parameters = new url.URLSearchParams({ token: '<value>' });
			const options = makeOptionsContext({ showQueryFields: true });

			const expected = { token: '<value>' };

			const actual = hook.getQueryFields(parameters, options);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return an object with specified parameters', () => {
			const parameters = new url.URLSearchParams({ token: '<value>', author: '<value>' });
			const options = makeOptionsContext({ showQueryFields: ['token'] });

			const expected = { token: '<value>' };

			const actual = hook.getQueryFields(parameters, options);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return an object without rejected fields', () => {
			const parameters = new url.URLSearchParams({ token: '<value>', author: '<value>' });
			const options = makeOptionsContext({ showQueryFields: true, hideQueryFields: ['token'] });

			const expected = { author: '<value>' };

			const actual = hook.getQueryFields(parameters, options);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.getPayloadFields', () => {
		it('should return an empty object when the payload is an undefined', () => {
			const options = makeOptionsContext({ showPayloadFields: true });

			const expected = {};

			const actual = hook.getPayloadFields(undefined, options);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return an empty object when the `showPayloadFields` is disabled', () => {
			const payload = { token: '<value>' };
			const options = makeOptionsContext({ showPayloadFields: false });

			const expected = {};

			const actual = hook.getPayloadFields(payload, options);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return an object with all fields when the `showPayloadFields` is enabled', () => {
			const payload = { token: '<value>' };

			const options = makeOptionsContext({ showPayloadFields: true });

			const expected = { token: '<value>' };

			const actual = hook.getPayloadFields(payload, options);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return an object with specified parameters', () => {
			const payload = { token: '<value>', author: '<value>' };
			const options = makeOptionsContext({ showPayloadFields: ['token'] });

			const expected = { token: '<value>' };

			const actual = hook.getPayloadFields(payload, options);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return an object without rejected fields', () => {
			const payload = { token: '<value>', author: '<value>' };
			const options = makeOptionsContext({ showPayloadFields: true, hidePayloadFields: ['token'] });

			const expected = { author: '<value>' };

			const actual = hook.getPayloadFields(payload, options);

			assert.deepStrictEqual(actual, expected);
		});
	});
});
