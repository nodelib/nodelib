import * as path from 'path';
import * as util from 'util';

import * as bencho from 'bencho';

import * as utils from '../utils';

import type { Options } from '@nodelib/fs.walk.previous';

type WalkImplementation = 'current' | 'previous';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WalkImplFunction = (...args: any[]) => Promise<unknown[]>;

interface WalkOptions extends Options {
	defaultFilter?: boolean;
	depthFilter?: boolean;
}

class Walk {
	constructor(private readonly _cwd: string, private readonly _options: WalkOptions) {
		if (_options.defaultFilter === true) {
			utils.assignDefaultFilter(_options);
		}

		if (_options.depthFilter === true) {
			utils.assignDepthFilter(_options);
		}
	}

	public async measurePreviousVersion(): Promise<void> {
		const walk = await utils.importAndMeasure(utils.importPrevious);
		const settings = new walk.Settings(this._options);

		const action = util.promisify(walk.walk);

		await this._measure(() => action(this._cwd, settings));
	}

	public async measureCurrentVersion(): Promise<void> {
		const walk = await utils.importAndMeasure(utils.importCurrent);
		const settings = new walk.Settings(this._options);

		const action = util.promisify(walk.walk);

		await this._measure(() => action(this._cwd, settings));
	}

	private async _measure(function_: WalkImplFunction): Promise<void> {
		const timeStart = utils.timeStart();

		const matches = await function_();

		const count = matches.length;
		const memory = utils.getMemory();
		const time = utils.timeEnd(timeStart);

		bencho.time('time', time);
		bencho.memory('memory', memory);
		bencho.value('entries', count);
	}
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
	const args = process.argv.slice(2);

	const impl = args[0] as WalkImplementation;
	const cwd = path.resolve(args[1] as string);
	const options = JSON.parse(process.env['BENCHMARK_OPTIONS'] ?? '{}') as WalkOptions;

	const walk = new Walk(cwd, options);

	switch (impl) {
		case 'current': {
			await walk.measureCurrentVersion();
			break;
		}

		case 'previous': {
			await walk.measurePreviousVersion();
			break;
		}

		default: {
			throw new TypeError('Unknown implementation');
		}
	}
})();
