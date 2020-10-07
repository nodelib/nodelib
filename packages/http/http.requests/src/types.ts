import Logger from './logger';

export type Context = {
	readonly logger: Logger;
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
};
