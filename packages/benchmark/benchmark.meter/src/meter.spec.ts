import * as assert from 'assert';

import Meter, { NSMeter } from './meter';

class TestMeter extends Meter {
	public latestOutputMessage?: string;

	protected _output(message: string): void {
		this.latestOutputMessage = message;
	}

	protected _getCurrentHrTime(): [number, number] {
		return [1, 0];
	}

	protected _getCurrentMemoryHeapUsage(): number {
		return 926;
	}
}

function makeOutputMessage(label: string, value: number, type: NSMeter.Type | number): string {
	return [NSMeter.Symbols.Prefix, label, type, value].join(NSMeter.Symbols.Separator);
}

describe('Meter', () => {
	describe('Constructor', () => {
		it('should return a instance of class', () => {
			const meter = new Meter();

			assert.ok(meter instanceof Meter);
		});
	});

	describe('.time', () => {
		it('should set time marker', () => {
			const meter = new TestMeter();

			const expected = makeOutputMessage('label', 1000000000, NSMeter.Type.Time);

			meter.time('label');

			const actual = meter.latestOutputMessage;

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.memory', () => {
		it('should set memory marker', () => {
			const meter = new TestMeter();

			const expected = makeOutputMessage('label', 926, NSMeter.Type.Memory);

			meter.memory('label');

			const actual = meter.latestOutputMessage;

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.common', () => {
		it('should set common marker', () => {
			const meter = new TestMeter();

			const expected = makeOutputMessage('label', 1, NSMeter.Type.Common);

			meter.common('label', 1);

			const actual = meter.latestOutputMessage;

			assert.deepStrictEqual(actual, expected);
		});

		it('should set common marker with specified type', () => {
			const meter = new TestMeter();

			const expected = makeOutputMessage('label', 1, NSMeter.Type.Time);

			meter.common('label', 1, NSMeter.Type.Time);

			const actual = meter.latestOutputMessage;

			assert.deepStrictEqual(actual, expected);
		});

		it('should set common marker with custom type', () => {
			const meter = new TestMeter();

			const enum CustomMeterType {
				Custom = 4
			}

			const expected = makeOutputMessage('label', 1, CustomMeterType.Custom);

			meter.common('label', 1, CustomMeterType.Custom);

			const actual = meter.latestOutputMessage;

			assert.deepStrictEqual(actual, expected);
		});

		it('should throw an error when metric type is difference', () => {
			const meter = new TestMeter();

			meter.common('label', 1);

			assert.throws(() => meter.time('label'), /The "label" label alredy exists with difference type/);
		});

		it('should set common marker when type is not a difference', () => {
			const meter = new TestMeter();

			const expected = makeOutputMessage('label', 1000000000, NSMeter.Type.Time);

			meter.common('label', 1, NSMeter.Type.Time);
			meter.time('label');

			const actual = meter.latestOutputMessage;

			assert.deepStrictEqual(actual, expected);
		});
	});
});
