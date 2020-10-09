import { URL } from 'url';

import { BeforeRedirectHook } from 'got';

import { Context } from '../types';

export function create(): BeforeRedirectHook {
	return (options, response) => {
		// Currently, we does not support logging a stream requests.
		if (options.isStream) {
			return;
		}

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
