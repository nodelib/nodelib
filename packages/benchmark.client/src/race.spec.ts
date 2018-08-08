import * as assert from 'assert';

import { Meter } from '@nodelib/benchmark.meter';

import * as tests from './tests/index';

import Race, { NSRace } from './race';

describe('Race', () => {
	describe('Constructor', () => {
		it('should return a instance of class', () => {
			const race = new Race('title', () => undefined);

			assert.ok(race instanceof Race);
		});
	});

	describe('.run', () => {
		it('should call the asynchronous callback function', async () => {
			const race = new Race('title', () => Promise.resolve(true));

			const actual = await race.run();

			assert.ok(actual);
		});

		it('should call the synchronous callback function', async () => {
			const race = new Race('title', () => true);

			const actual = await race.run();

			assert.ok(actual);
		});

		it('should call the callback function with right context', async () => {
			const race = new Race('title', (ctx) => Promise.resolve(ctx));

			const expected: NSRace.CallbackContext = {
				meter: new Meter()
			};

			const actual = await race.run();

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.accept', () => {
		it('should call a correct visit method', () => {
			const race = new Race('title', () => undefined);

			const visitor = new tests.visitor.TestVisitor();

			race.accept(visitor);

			assert.strictEqual(visitor.visitRaceStub.callCount, 1);
			assert.deepStrictEqual(visitor.visitRaceStub.firstCall.args, [race]);
		});
	});
});
