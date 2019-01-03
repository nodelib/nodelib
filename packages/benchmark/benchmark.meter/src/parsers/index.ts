export default abstract class ReportParser<TData, TReturn> {
	/**
	 * Returns markers of metrics from output of reporter.
	 *
	 * @param data - The data from which to retrieve markers. The type of data depends on the reporter.
	 */
	public abstract parse(data: TData): TReturn;
}
