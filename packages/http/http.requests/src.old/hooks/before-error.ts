import { BeforeErrorHook, RequestError } from 'got';

import { Context } from '../types';

export function create(): BeforeErrorHook {
	return (error) => {
		const options = error.options;

		// Currently, we does not support logging a stream requests.
		if (options.isStream) {
			return error;
		}

		const context = options.context as Context;

		if (!isHttpError(error)) {
			context.logger.logError({
				type: 'response',
				id: context.request.id,
				method: options.method,
				url: options.url,
				info: {
					code: error.code,
					message: error.message
				}
			});
		}

		return error;
	};
}

export function isHttpError(error: RequestError): boolean {
	return error.name === 'HTTPError';
}
