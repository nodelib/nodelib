import * as sinon from 'sinon';

import StdoutReporter from './stdout';

describe('StdoutReporter', () => {
	const sandbox = sinon.createSandbox();

	before(() => {
		sandbox.stub(console, 'info');
	});

	after(() => {
		sandbox.restore();
	});

	describe('.report', () => {
		it('should call report method with correct set of arguments', () => {
			const reporter = new StdoutReporter();

			const expected = '__METER__{"label":"label","value":"value"}';

			reporter.report('label', 'value');

			sinon.assert.calledWith(console.info as sinon.SinonStub, expected);
		});
	});
});
