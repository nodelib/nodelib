import Reporter from './index';

export default class StdoutReporter extends Reporter {
	/**
	 * A text used as a prefix for output.
	 */
	public static readonly prefix: string = '__METER__';

	/**
	 * Inherit description from abstract {@link Reporter.report} method.
	 *
	 * @remarks
	 * Adds special prefix ({@link prefix}) to distinguish markers from noise.
	 *
	 * @example
	 * reporter.report('label', 'value');
	 * reporter.report('label', 123);
	 */
	public report(label: string, value: string | number): void {
		const message = this._formatMessage(label, value);

		console.info(message);
	}

	private _formatMessage(label: string, value: string | number): string {
		return StdoutReporter.prefix + JSON.stringify({ label, value });
	}
}
