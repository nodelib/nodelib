import * as assert from 'assert';

import StdoutReporter from '../reporters/stdout';
import StdoutReportParser, { ReportMarker } from './stdout';

describe('StdoutReportParser', () => {
	describe('.parse', () => {
		it('should return empty array for empty input stdout', () => {
			const parser = new StdoutReportParser();

			const expected: ReportMarker[] = [];

			const actual = parser.parse('');

			assert.deepStrictEqual(actual, expected);
		});

		it('should return empty array for stdout without markers', () => {
			const parser = new StdoutReportParser();

			const expected: ReportMarker[] = [];

			const actual = parser.parse('__something__\n123');

			assert.deepStrictEqual(actual, expected);
		});

		it('should return array of markers', () => {
			const parser = new StdoutReportParser();

			const expected: ReportMarker[] = [
				{ name: 'a', value: 'a' },
				{ name: 'b', value: 1 }
			];

			const actual = parser.parse([
				`${StdoutReporter.prefix}${JSON.stringify({ name: 'a', value: 'a' })}`,
				`${StdoutReporter.prefix}${JSON.stringify({ name: 'b', value: 1 })}`
			].join('\n'));

			assert.deepStrictEqual(actual, expected);
		});
	});
});
