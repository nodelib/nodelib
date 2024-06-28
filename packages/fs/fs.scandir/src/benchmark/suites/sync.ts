import * as path from 'node:path';

import * as bencho from 'bencho';

import * as utils from '../utils';

import type { Options } from '@nodelib/fs.scandir.previous';

type BenchOptions = Omit<Options, 'fs'>;

type ScandirImplementation = 'current' | 'previous';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ScandirImplFunction = (...args: any[]) => unknown[];

class Scandir {
	readonly #cwd: string;
	readonly #options: BenchOptions;

	constructor(cwd: string, options: BenchOptions) {
		this.#cwd = cwd;
		this.#options = options;
	}

	public async measurePreviousVersion(): Promise<void> {
		const scandir = await utils.importAndMeasure(utils.importPrevious);
		const settings = new scandir.Settings(this.#options);

		this.#measure(() => scandir.scandirSync(this.#cwd, settings));
	}

	public async measureCurrentVersion(): Promise<void> {
		const scandir = await utils.importAndMeasure(utils.importCurrent);
		const settings = new scandir.Settings(this.#options);

		this.#measure(() => scandir.scandirSync(this.#cwd, settings));
	}

	#measure(function_: ScandirImplFunction): void {
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
