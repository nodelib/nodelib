import * as url from 'url';
import * as util from 'util';

export type MessageType = 'request' | 'redirect' | 'response' | 'retry';

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

	private _getBaseMessage(message: Message<unknown>): MessageBase {
		return {
			type: message.type,
			id: message.id,
			method: message.method,
			url: url.format(message.url, { search: false })
		};
	}
}
