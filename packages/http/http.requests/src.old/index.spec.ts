import * as nock from 'nock';
import * as sinon from 'sinon';

import Logger, { ILogger } from './logger';
import requests from '.';

const TEST_SERVER_URL = 'https://www.example.com';
const TEST_URL = `${TEST_SERVER_URL}/api`;

class LoggerFake extends Logger {
	public readonly _log: sinon.SinonStub = sinon.stub();
}

function getRequests(logger: ILogger): typeof requests {
	return requests.extend({
		context: { logger }
	});
}

describe.only('Package', () => {
	describe('Errors', () => {
		it('should log network error', async () => {
			nock(TEST_SERVER_URL)
				.get('/api')
				.replyWithError({ code: 'ENOTFOUND', message: 'qwe' });

			const logger = new LoggerFake();

			const http = getRequests(logger);

			const response = await http(TEST_URL, {});

			console.dir(response, { colors: true });
		});
	});
});
