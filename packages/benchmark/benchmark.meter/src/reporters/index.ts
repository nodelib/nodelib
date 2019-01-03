export default abstract class Reporter {
	/**
	 * Sets the marker of the metric with the specified label and value.
	 *
	 * @param label - The name of the marker.
	 * @param value - The value of the marker.
	 */
	public abstract report(label: string, value: string | number): unknown;
}
