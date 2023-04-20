import * as path from 'path';

import * as bencho from 'bencho';

import * as utils from '../utils';

import type { Options } from '@nodelib/fs.scandir.previous';

type ScandirImplementation = 'current' | 'previous';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ScandirImplFunction = (...args: any[]) => unknown[];

class Scandir {
	constructor(private readonly _cwd: string, private readonly _options: Options) {}

	public async measurePreviousVersion(): Promise<void> {
		const scandir = await utils.importAndMeasure(utils.importPrevious);
		const settings = new scandir.Settings(this._options);

		this._measure(() => scandir.scandirSync(this._cwd, settings));
	}

	public async measureCurrentVersion(): Promise<void> {
		const scandir = await utils.importAndMeasure(utils.importCurrent);
		const settings = new scandir.Settings(this._options);

		this._measure(() => scandir.scandirSync(this._cwd, settings));
	}

	private _measure(function_: ScandirImplFunction): void {
		const timeStart = utils.timeStart();

		const matches = function_();

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

	const impl = args[0] as ScandirImplementation;
	const cwd = path.join(process.cwd(), args[1] as string);
	const options = JSON.parse(process.env['BENCHMARK_OPTIONS'] ?? '{}') as Options;

	const scandir = new Scandir(cwd, options);

	switch (impl) {
		case 'current': {
			await scandir.measureCurrentVersion();
			break;
		}

		case 'previous': {
			await scandir.measurePreviousVersion();
			break;
		}

		default: {
			throw new TypeError('Unknown implementation');
		}
	}
})();
