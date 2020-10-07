import * as crypto from 'crypto';

import { InitHook, Headers } from 'got';

import { X_REQUEST_ID_HEADER_NAME, TRUNCATE_RESPONSE_BODY_AFTER } from '../constants';
import { Context, RequestContext, OptionsContext } from '../types';
import Logger from '../logger';

const logger = new Logger();

export function create(): InitHook {
	return (options) => {
		const context = buildContext(options.context);

		options.context = context;

		options.headers = {
			...options.headers,
			[X_REQUEST_ID_HEADER_NAME]: context.request.id
		};
	};
}

export function buildContext(context?: Partial<Context>): Context {
	return {
		logger,
		request: buildRequestContext(context?.request),
		options: buildOptionsContext(context?.options)
	};
}

export function buildRequestContext(context?: Partial<RequestContext>): RequestContext {
	return {
		id: getRequestId(context),
		...context
	};
}

export function buildOptionsContext(context?: Partial<OptionsContext>): OptionsContext {
	return {
		truncateResponseBodyAfter: TRUNCATE_RESPONSE_BODY_AFTER,
		...context
	};
}

export function getRequestId(headers: Headers = {}): string {
	const header = headers[X_REQUEST_ID_HEADER_NAME];
	const value = Array.isArray(header) ? header[0] : header;

	if (value === undefined) {
		// eslint-disable-next-line @typescript-eslint/no-magic-numbers
		return crypto.randomBytes(16).toString('hex');
	}

	return value;
}
