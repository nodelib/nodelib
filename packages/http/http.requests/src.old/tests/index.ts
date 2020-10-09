import * as url from 'url';

import * as sinon from 'sinon';
import got, { Options, NormalizedOptions, Response } from 'got';

import { OptionsContext, Context, RequestContext } from '../types';
import Logger from '../logger';

export function makeLogger(): sinon.SinonStubbedInstance<Logger> {
	return sinon.createStubInstance(Logger);
}

export function makeContext(context: Partial<Context> = {}): Context {
	return {
		logger: makeLogger(),
		options: makeOptionsContext(context.options),
		request: makeRequestContext(context.request),
		...context
	};
}

export function makeOptionsContext(context: Partial<OptionsContext> = {}): OptionsContext {
	return {
		truncateResponseBodyAfter: 200,
		showQueryFields: false,
		hideQueryFields: [],
		showPayloadFields: false,
		hidePayloadFields: [],
		...context
	};
}

export function makeRequestContext(context: Partial<RequestContext> = {}): RequestContext {
	return {
		id: '<request>',
		...context
	};
}

export function makeNormalizedOptions(options: Options = {}): NormalizedOptions {
	return got.mergeOptions({
		url: new url.URL('https://site.com'),
		...options
	});
}

export function makeResponse(response: Partial<Response> = {}): Response {
	return {
		body: '<value>',
		...response
	} as unknown as Response;
}
