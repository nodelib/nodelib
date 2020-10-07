import { BeforeRequestHook } from 'got';

import { Context, OptionsContext } from '../types';

export function create(): BeforeRequestHook {
	return (options) => {
		const context = options.context as Context;
		const query = getQueryFields(options.url.searchParams, context.options);
		const payload = getPayloadFields(options.json, context.options);

		context.logger.logRequest({
			type: 'request',
			id: context.request.id,
			method: options.method,
			url: options.url,
			info: {
				query,
				payload
			}
		});
	};
}

export function getQueryFields(parameters: URLSearchParams, options: OptionsContext): Record<string, string> {
	const result: Record<string, string> = {};

	const showQueryFields = options.showQueryFields;

	if (showQueryFields === false) {
		return result;
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

export function getPayloadFields(payload: Record<string, unknown> | undefined, options: OptionsContext): Record<string, unknown> {
	const result: Record<string, unknown> = {};

	const showPayloadFields = options.showPayloadFields;

	if (payload === undefined || showPayloadFields === false) {
		return result;
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
