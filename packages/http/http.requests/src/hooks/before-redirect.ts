import { URL } from 'url';

import { BeforeRedirectHook } from 'got';

import { Context } from '../types';

export function create(): BeforeRedirectHook {
	return (options, response) => {
		const context = options.context as Context;

		context.logger.logRedirect({
			type: 'redirect',
			id: context.request.id,
			method: options.method,
			url: new URL(response.requestUrl),
			info: {
				redirect: options.url
			}
		});
	};
}
