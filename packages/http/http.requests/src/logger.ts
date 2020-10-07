import * as url from 'url';
import * as util from 'util';

export type MessageType = 'request' | 'redirect' | 'response' | 'retry-planned' | 'retry-skipped';

export type Message<T> = {
	readonly type: MessageType;
	readonly id: string;
	readonly method: string;
	readonly url: url.URL;
	readonly info: T;
};

export type RequestMessage = Message<{}>;
export type RedirectMessage = Message<{
	readonly redirect: url.URL;
}>;
export type ResponseMessage = Message<{
	readonly status: number;
	readonly message?: string;
	readonly body?: string;
}>;
export type ErrorMessage = Message<{
	readonly code?: string;
	readonly message: string;
}>;
export type RetryPlannedMessage = Message<{
	readonly attempt: number;
	readonly limit: number;
	readonly delay: number;
	readonly next: Date;
}>;

export type MessageBase = {
	readonly type: string;
	readonly id: string;
	readonly method: string;
	readonly url: string;
};

export default class Logger {
	private readonly _log: ReturnType<typeof util.debuglog> = util.debuglog('nodelib.http.requests');

	public logRequest(message: RequestMessage): void {
		this._log(JSON.stringify({
			...this._getBaseMessage(message),
			info: message.info
		}));
	}

	public logRedirect(message: RedirectMessage): void {
		this._log(JSON.stringify({
			...this._getBaseMessage(message),
			redirect: url.format(message.info.redirect, { search: false })
		}));
	}

	public logResponse(message: ResponseMessage): void {
		this._log(JSON.stringify({
			...this._getBaseMessage(message),
			status: message.info.status,
			message: message.info.message,
			body: message.info.body
		}));
	}

	public logError(message: ErrorMessage): void {
		this._log(JSON.stringify({
			...this._getBaseMessage(message),
			code: message.info.code,
			message: message.info.message
		}));
	}

	public logRetry(message: RetryPlannedMessage): void {
		this._log(JSON.stringify({
			...this._getBaseMessage(message),
			attempt: message.info.attempt,
			limit: message.info.limit,
			delay: message.info.delay,
			next: message.info.next.toISOString()
		}));
	}

	private _getBaseMessage(message: Message<unknown>): MessageBase {
		return {
			type: message.type,
			id: message.id,
			method: message.method,
			url: url.format(message.url, { search: false })
		};
	}
}