import * as path from 'node:path';
import * as process from 'node:process';
import * as util from 'node:util';
import * as bencho from 'bencho';
import type { Options } from '@nodelib/fs.scandir.previous';
import * as utils from '../utils.js';

type ScandirImplementation = 'current' | 'previous';

type ScandirImplFunction = (...args: any[]) => Promise<unknown[]>;

class Scandir {
	readonly #cwd: string;
	readonly #options: Options;

	constructor(cwd: string, options: Options) {
		this.#cwd = cwd;
		this.#options = options;
	}

	async #measure(function_: ScandirImplFunction): Promise<void> {
		const timeStart = utils.timeStart();

		const matches = await function_();

		const count = matches.length;
		const memory = utils.getMemory();
		const time = utils.timeEnd(timeStart);

		bencho.time('time', time);
		bencho.memory('memory', memory);
		bencho.value('entries', count);
	}

	public async measurePreviousVersion(): Promise<void> {
		const scandir = await utils.importAndMeasure(utils.importPrevious);
		const settings = new scandir.Settings(this.#options);

		const action = util.promisify(scandir.scandir);

		await this.#measure(async () => action(this.#cwd, settings));
	}

	public async measureCurrentVersion(): Promise<void> {
		const scandir = await utils.importAndMeasure(utils.importCurrent);
		const settings = new scandir.Settings(this.#options);

		const action = util.promisify(scandir.scandir);

		await this.#measure(async () => action(this.#cwd, settings));
	}
}

(async () => {
	const args = process.argv.slice(2);

	const impl = args[0] as ScandirImplementation;
	const cwd = path.join(process.cwd(), args[1]!);
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

		// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
		default: {
			throw new TypeError('Unknown implementation');
		}
	}
})();
