import { BeforeRequestHook } from 'got';

import { Context, OptionsContext } from '../types';

export function create(): BeforeRequestHook {
	return (options) => {
		const context = options.context as Context;
		const query = getQueryFields(options.url.searchParams, context.options);

		context.logger.logRequest({
			type: 'request',
			id: context.request.id,
			method: options.method,
			url: options.url,
			info: {
				query
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
