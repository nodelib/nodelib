import StdoutReporter from '../reporters/stdout';
import ReportParser from './index';

export interface ReportMarker {
	name: string;
	value: string | number;
}

export default class StdoutReportParser extends ReportParser<string, ReportMarker[]> {
	/**
	 * Inherit description from abstract {@link ReportParser.parse} method.
	 *
	 * @remarks
	 * Returns the marker of metrics from lines that starts with {@link StdoutReporter.prefix}.
	 *
	 * @example
	 * parser.parse('__METER__{ "name": "some_name", "value": 123 }');
	 */
	public parse(stdout: string): ReportMarker[] {
		return stdout.split('\n')
			.filter(this.isStdoutReporterLine, this)
			.map(this.convertLineToReportItem, this);
	}

	private isStdoutReporterLine(line: string): boolean {
		return line.startsWith(StdoutReporter.prefix);
	}

	private convertLineToReportItem(line: string): ReportMarker {
		const payload = line.replace(StdoutReporter.prefix, '');

		return JSON.parse(payload) as ReportMarker;
	}
}
