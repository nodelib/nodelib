import * as assert from 'assert';

import * as nock from 'nock';
import * as sinon from 'sinon';

import Logger from './logger';
import requests from '.';

const TEST_SERVER_URL = 'https://www.example.com';
const TEST_URL = `${TEST_SERVER_URL}/api`;

class LoggerFake extends Logger {
	public readonly stub: sinon.SinonStub = sinon.stub();

	protected _log(message: unknown): void {
		this.stub(message);
	}
}

function getLogger(): LoggerFake {
	return new LoggerFake();
}

function getRequests(logger: LoggerFake): typeof requests {
	return requests.extend({
		context: {
			extend: true,
			logger
		}
	});
}

describe('Package', () => {
	describe('Initialization', () => {
		it('should set a random request id', async () => {
			nock(TEST_SERVER_URL)
				.get('/api')
				.matchHeader('x-request-id', (value: string | undefined) => {
					if (value === undefined || !/\w+/.test(value)) {
						assert.fail('The request does not have a header');
					}

					return true;
				})
				.reply(200);

			await requests(TEST_URL, {});
		});

		it('should use specified request id', async () => {
			nock(TEST_SERVER_URL)
				.get('/api')
				.matchHeader('x-request-id', '<request>')
				.reply(200);

			await requests(TEST_URL, {
				context: {
					request: { id: '<request>' }
				}
			});
		});
	});

	describe.only('Redirect', () => {
		it('should log redirect', async () => {
			const logger = getLogger();
			const http = getRequests(logger);

			nock(TEST_SERVER_URL)
				.get('/api')
				.reply(301, undefined, {
					Location: `${TEST_SERVER_URL}/redirect`
				})
				.get('/redirect')
				.reply(200);

			await http(TEST_URL, {
				context: {
					call: true,
					request: { id: '<value>' }
				}
			});
		});
	});
});
