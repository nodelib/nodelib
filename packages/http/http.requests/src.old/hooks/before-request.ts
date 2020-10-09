import { BeforeRequestHook } from 'got';

import { Context, OptionsContext, Query, Payload } from '../types';

export function create(): BeforeRequestHook {
	return (options) => {
		// Currently, we does not support logging a stream requests.
		if (options.isStream) {
			return;
		}

		const context = options.context as Context;

		context.logger.logRequest({
			type: 'request',
			id: context.request.id,
			method: options.method,
			url: options.url,
			info: {
				query: getQueryFields(options.url.searchParams, context.options),
				payload: getPayloadFields(options.json, context.options)
			}
		});
	};
}

export function getQueryFields(parameters: URLSearchParams, options: OptionsContext): Query | undefined {
	const result: Query = {};

	const showQueryFields = options.showQueryFields;

	if (showQueryFields === false) {
		return undefined;
	}

	for (const [key, value] of parameters.entries()) {
		if (options.hideQueryFields.includes(key)) {
			continue;
		}

		if (showQueryFields === true || showQueryFields.includes(key)) {
			result[key] = value;
		}
	}

	return result;
}

export function getPayloadFields(payload: Payload | undefined, options: OptionsContext): Payload | undefined {
	const result: Payload = {};

	const showPayloadFields = options.showPayloadFields;

	if (payload === undefined || showPayloadFields === false) {
		return undefined;
	}

	for (const [key, value] of Object.entries(payload)) {
		if (options.hidePayloadFields.includes(key)) {
			continue;
		}

		if (showPayloadFields === true || showPayloadFields.includes(key)) {
			result[key] = value;
		}
	}

	return result;
}
