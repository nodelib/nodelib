import * as assert from 'assert';

import Meter from './meter';

class TestMeter extends Meter {
	public latestMessage?: string;

	protected _log(message: string): void {
		this.latestMessage = message;
	}

	protected _getCurrentHrTime(): [number, number] {
		return [1, 926];
	}

	protected _getCurrentMemoryHeapUsage(): number {
		return 926;
	}
}

describe('Common → Meter', () => {
	describe('Constructor', () => {
		it('should return instance of class', () => {
			const meter = new Meter();

			assert.ok(meter instanceof Meter);
		});
	});

	describe('.time', () => {
		it('should send a marker to the console', () => {
			const meter = new TestMeter();

			const extepected = '__METER__;label;1000000926';

			meter.time('label');

			assert.strictEqual(meter.latestMessage, extepected);
		});
	});

	describe('.memory', () => {
		it('should send a marker to the console', () => {
			const meter = new TestMeter();

			const extepected = '__METER__;label;926';

			meter.memory('label');

			assert.strictEqual(meter.latestMessage, extepected);
		});
	});

	describe('.common', () => {
		it('should send a marker to the console', () => {
			const meter = new TestMeter();

			const extepected = '__METER__;label;123';

			meter.common('label', 123);

			assert.strictEqual(meter.latestMessage, extepected);
		});
	});
});
