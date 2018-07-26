import * as assert from 'assert';

import * as sinon from 'sinon';

import TestVisitor from '../tests/visitor';

import Race from './race';

import Meter from '../common/meter';

const noop = () => undefined;

describe('Client → Race', () => {
	describe('Constructor', () => {
		it('should return instance of class', () => {
			const race = new Race('title', noop);

			assert.ok(race instanceof Race);
		});
	});

	describe('.title', () => {
		it('should work as a getter', () => {
			const race = new Race('title', noop);

			const expected = 'title';

			assert.strictEqual(race.title, expected);
		});
	});

	describe('.callback', () => {
		it('should work as a getter', () => {
			const race = new Race('title', noop);

			const expected = noop;

			assert.strictEqual(race.callback, expected);
		});
	});

	describe('.meter', () => {
		it('should work as a getter', () => {
			const race = new Race('title', noop);

			assert.ok(race.meter instanceof Meter);
		});
	});

	describe('.run', () => {
		it('should call a callback function', async () => {
			const callback = sinon.stub();
			const race = new Race('title', callback);

			const expected = 1;

			await race.run();

			assert.strictEqual(callback.callCount, expected);
		});
	});

	describe('.accept', () => {
		it('should call a correct visit method', () => {
			const race = new Race('title', noop);

			const visitor = new TestVisitor();

			const expected = 1;

			race.accept(visitor);

			assert.strictEqual(visitor.visitRaceStub.callCount, expected);
			assert.deepStrictEqual(visitor.visitRaceStub.firstCall.args, [race]);
		});
	});
});
