import * as assert from 'assert';

import * as sinon from 'sinon';

import Meter from './meter';
import Reporter from './reporters/index';

describe('Meter', () => {
	const sandbox = sinon.createSandbox();

	before(() => {
		sandbox.stub(process, 'hrtime').returns([1, 100]);
		sandbox.stub(process, 'memoryUsage').returns({ heapUsed: 100 } as NodeJS.MemoryUsage);
	});

	after(() => {
		sandbox.restore();
	});

	describe('Constructor', () => {
		it('should return a instance of class', () => {
			const actual = new Meter({} as Reporter);

			assert.ok(actual instanceof Meter);
		});
	});

	describe('.time', () => {
		it('should report marker', () => {
			const report = sinon.stub();

			new Meter({ report }).time('time');

			sinon.assert.calledWith(report, 'time', 1000000100);
		});
	});

	describe('.memory', () => {
		it('should report marker', () => {
			const report = sinon.stub();

			new Meter({ report }).memory('memory');

			sinon.assert.calledWith(report, 'memory', 100);
		});
	});

	describe('.common', () => {
		it('should report marker', () => {
			const report = sinon.stub();

			new Meter({ report }).common('label', 1);

			sinon.assert.calledWith(report, 'label', 1);
		});
	});
});
