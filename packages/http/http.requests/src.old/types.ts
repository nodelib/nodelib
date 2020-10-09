import { ILogger } from './logger';

export type Context = {
	readonly logger: ILogger;
	readonly request: RequestContext;
	readonly options: OptionsContext;
};

export type RequestContext = {
	readonly id: string;
};

export type OptionsContext = {
	readonly truncateResponseBodyAfter: number;
	readonly showQueryFields: boolean | string[];
	readonly hideQueryFields: string[];
	readonly showPayloadFields: boolean | string[];
	readonly hidePayloadFields: string[];
};

export type Query = Record<string, string>;
export type Payload = Record<string, unknown>;
