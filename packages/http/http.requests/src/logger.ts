import * as url from 'url';
import * as util from 'util';

export type MessageType = 'request' | 'redirect' | 'response' | 'retry';

export type Message = {
	readonly type: MessageType;
	readonly id: string;
	readonly method: string;
	readonly url: url.URL;
	readonly info: Record<string, unknown>;
};

export type MessageBase = {
	readonly type: string;
	readonly id: string;
	readonly method: string;
	readonly url: string;
};

export default class Logger {
	private readonly _log: ReturnType<typeof util.debuglog> = util.debuglog('nodelib.http.requests');

	public logRequest(message: Message): void {
		const base = this._getBaseMessage(message);

		this._log(JSON.stringify({
			...base,
			info: message.info
		}));
	}

	private _getBaseMessage(message: Message): MessageBase {
		return {
			type: message.type,
			id: message.id,
			method: message.method,
			url: url.format(message.url, { search: false })
		};
	}
}
