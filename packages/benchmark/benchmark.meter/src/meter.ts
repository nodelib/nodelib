export namespace NSMeter {
	export enum Symbols {
		/**
		 * The text used as a prefix for output.
		 */
		Prefix = '__METER__',
		/**
		 * The text used as separator for values in the output.
		 */
		Separator = ';'
	}

	export enum Type {
		Time,
		Memory,
		Common
	}

	export type TypeStorage = Map<string, Type>;
}

export default class Meter {
	private readonly _storage: NSMeter.TypeStorage = new Map();

	/**
	 * Sets the time marker.
	 */
	public time(label: string): void {
		this._report(label, NSMeter.Type.Time, this._getCurrentNanoseconds());
	}

	/**
	 * Sets the memory marker.
	 */
	public memory(label: string): void {
		this._report(label, NSMeter.Type.Memory, this._getCurrentMemoryHeapUsage());
	}

	/**
	 * Sets the common marker.
	 */
	public common(label: string, value: number, type: NSMeter.Type | number = NSMeter.Type.Common): void {
		this._report(label, type, value);
	}

	/**
	 * Returns the current high-resolution real time, converted to nanoseconds.
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

		return process.memoryUsage().heapUsed;
	}

	/**
	 * Displays a message in the output.
	 */
	protected _output(message: string): void {
		console.debug(message);
	}

	/**
	 * Prepares and displays a marker in the log.
	 */
	private _report(label: string, type: NSMeter.Type, value: number): void {
		this._validateType(label, type);

		const message = this._formatOutputMessage(label, type, value);

		this._output(message);
	}

	/**
	 * Format a output message.
	 */
	private _formatOutputMessage(label: string, type: NSMeter.Type, value: number): string {
		return [NSMeter.Symbols.Prefix, label, type, value].join(NSMeter.Symbols.Separator);
	}

	/**
	 * Validate type beetwen metric's with same label.
	 */
	private _validateType(label: string, type: NSMeter.Type): void | never {
		const item = this._storage.get(label);
		if (item === undefined) {
			this._storage.set(label, type);

			return;
		}

		if (item === type) {
			return;
		}

		throw new TypeError(`The "${label}" label alredy exists with difference type`);
	}
}
