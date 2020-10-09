import * as url from 'url';

export type ILogger = {
	readonly logRedirect: LoggerFunction<RedirectMessage>;
};

export type LoggerFunction<T extends Message<unknown>> = (message: T) => void;

export type MessageType = 'request' | 'redirect' | 'response' | 'retry-planned' | 'retry-skipped';

export type Message<T> = {
	readonly type: MessageType;
	readonly id: string;
	readonly method: string;
	readonly url: url.URL;
	readonly info: T;
};

export type RedirectMessage = Message<{
	readonly redirect: url.URL;
}>;

export default class Logger implements ILogger {
	public logRedirect(message: RedirectMessage): void {
		this._log(message);
	}

	protected _log(message: Message<unknown>): void {
		console.log(JSON.stringify(message));
	}
}
