import Reporter from './reporters/index';

export default class Meter {
	/**
	 * @param _reporter - An instance of a reporter used to set markers.
	 */
	constructor(private readonly _reporter: Reporter) { }

	/**
	 * Sets the marker of the time metric with the specified label.
	 * The current high-resolution real time is used as the value.
	 *
	 * @param label - The name of the marker.
	 *
	 * @example
	 * meter.time('some_time_marker');
	 */
	public time(label: string): void {
		this.common(label, this._getCurrentNanoseconds());
	}

	/**
	 * Sets the marker of the memory metric with the specified label.
	 * The current HU (Heap Used) is used as the value.
	 *
	 * @param label - The name of the marker.
	 *
	 * @example
	 * meter.memory('some_memory_marker');
	 */
	public memory(label: string): void {
		this.common(label, this._getCurrentMemoryHeapUsage());
	}

	/**
	 * Sets the marker of the metric with the specified label and value.
	 *
	 * @param label - The name of the marker.
	 * @param value - The value of the marker.
	 *
	 * @example
	 * meter.common('some_common_marker', 'value');
	 * meter.common('some_common_marker', 123);
	 */
	public common(label: string, value: string | number): void {
		this._reporter.report(label, value);
	}

	private _getCurrentNanoseconds(): number {
		const hrtime = process.hrtime();

		return hrtime[0] * 1e9 + hrtime[1];
	}

	private _getCurrentMemoryHeapUsage(): number {
		const memoryUsage = process.memoryUsage();

		return memoryUsage.heapUsed;
	}
}
