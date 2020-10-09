import * as crypto from 'crypto';

import { InitHook, Headers, RequiredRetryOptions, RetryFunction } from 'got';

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

		options.retry = buildRetryConfiguration(options.retry);
	};
}

export function buildContext(context?: Partial<Context>): Context {
	return {
		logger,
		request: buildRequestContext(context?.request),
		options: buildOptionsContext(context?.options),
		...context
	};
}

function buildRequestContext(context?: Partial<RequestContext>): RequestContext {
	return {
		id: getRequestId(context),
		...context
	};
}

function buildOptionsContext(context?: Partial<OptionsContext>): OptionsContext {
	return {
		truncateResponseBodyAfter: TRUNCATE_RESPONSE_BODY_AFTER,
		showQueryFields: false,
		hideQueryFields: [],
		showPayloadFields: false,
		hidePayloadFields: [],
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

export function buildRetryConfiguration(retry: Partial<RequiredRetryOptions> | number | undefined): Partial<RequiredRetryOptions> | number | undefined {
	const calculateDelay = buildCalculateDelayFunction();

	if (typeof retry === 'number') {
		return {
			limit: retry,
			calculateDelay
		};
	}

	return {
		...retry,
		calculateDelay
	};
}

export function buildCalculateDelayFunction(): RetryFunction {
	return (retry) => {
		const options = retry.error.options;
		const context = options.context as Context;

		const delay = Math.trunc(retry.computedValue);
		const time = Date.now() + delay;

		if (delay !== 0) {
			context.logger.logPlannedRetry({
				type: 'retry-planned',
				id: context.request.id,
				method: options.method,
				url: options.url,
				info: {
					attempt: retry.attemptCount,
					limit: retry.retryOptions.limit,
					delay,
					next: new Date(time)
				}
			});
		}

		return delay;
	};
}
