import * as assert from 'assert';

import * as pkg from './index';

describe('Package', () => {
	it('should return correct set of properties', () => {
		const expected: typeof pkg = {
			Meter: pkg.Meter,

			Reporter: pkg.Reporter,
			StdoutReporter: pkg.StdoutReporter,

			ReportParser: pkg.ReportParser,
			StdoutReportParser: pkg.StdoutReportParser
		};

		const actual = pkg;

		assert.deepStrictEqual(actual, expected);
	});
});
