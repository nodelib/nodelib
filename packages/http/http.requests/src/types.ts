import { ILogger } from './logger';

export type Context = {
	readonly logger: ILogger;
	readonly request: RequestContext;
};

export type RequestContext = {
	readonly id: string;
};
