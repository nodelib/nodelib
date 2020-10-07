import { BeforeRequestHook } from 'got';

import { Context } from '../types';

export function create(): BeforeRequestHook {
	return (options) => {
		const context = options.context as Context;

		context.logger.logRequest({
			type: 'request',
			id: context.request.id,
			method: options.method,
			url: options.url,
			info: {}
		});
	};
}
