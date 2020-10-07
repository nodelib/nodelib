import { AfterResponseHook, Response } from 'got';

import { Context } from '../types';

export function create(): AfterResponseHook {
	return (response) => {
		const options = response.request.options;
		const context = options.context as Context;

		context.logger.logResponse({
			type: 'response',
			id: context.request.id,
			method: options.method,
			url: options.url,
			info: {
				status: response.statusCode,
				message: response.statusMessage,
				body: extractBody(response, context.options.truncateResponseBodyAfter)
			}
		});

		return response;
	};
}

export function extractBody(response: Response, limit: number): string | undefined {
	if (typeof response.body === 'string') {
		if (response.body.length <= limit) {
			return response.body;
		}

		return response.body.slice(0, limit) + '<truncated>';
	}

	return undefined;
}
