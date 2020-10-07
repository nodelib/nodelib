import Logger from './logger';

export type Context = {
	readonly logger: Logger;
	readonly request: RequestContext;
};

export type RequestContext = {
	readonly id: string;
};
