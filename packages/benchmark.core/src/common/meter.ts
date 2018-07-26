export type Measurements = Map<string, number>;

export const METER_PREFIX = '__METER__';
export const METER_PARTIALS_SEPARATOR = ';';

export default class Meter {
	/**
	 * Sets the time marker for measurements.
	 */
	public time(label: string): void {
		this._report(label, this._getCurrentNanoseconds());
	}

	/**
	 * Sets the memory marker for measurements.
	 */
	public memory(label: string): void {
		this._report(label, this._getCurrentMemoryHeapUsage());
	}

	/**
	 * Sets the common marker for measurements.
	 */
	public common(label: string, value: number): void {
		this._report(label, value);
	}

	/**
	 * Returns the current high-resolution real time converted to nanoseconds.
	 */
	protected _getCurrentNanoseconds(): number {
		const hrtime = this._getCurrentHrTime();

		return hrtime[0] * 1e9 + hrtime[1];
	}

	/**
	 * Returns the current high-resolution real time.
	 */
	protected _getCurrentHrTime(): [number, number] {
		return process.hrtime();
	}

	/**
	 * Returns the current memory usage of the Node.js process measured in bytes.
	 * Previoysly request Garbage Collection.
	 */
	protected _getCurrentMemoryHeapUsage(): number {
		if ('gc' in global) {
			global.gc();
		}

		return process.memoryUsage().heapUsed; // @todo: rss?
	}

	/**
	 * Displays a message in the log.
	 */
	protected _log(message: string): void {
		console.log(message);
	}

	/**
	 * Prepares and displays a marker in the log.
	 */
	private _report(label: string, value: number): void {
		this._log([METER_PREFIX, label, value].join(METER_PARTIALS_SEPARATOR));
	}
}
