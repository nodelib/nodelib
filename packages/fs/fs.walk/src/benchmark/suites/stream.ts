import * as path from 'node:path';
import * as process from 'node:process';
import type { Readable } from 'node:stream';
import * as bencho from 'bencho';
import type { Options } from '@nodelib/fs.walk.previous';
import * as utils from '../utils.js';

type WalkImplementation = 'current' | 'previous';

type WalkImplFunction = (...args: any[]) => Readable;

type WalkOptions = {
	defaultFilter?: boolean;
	depthFilter?: boolean;
} & Options;

class Walk {
	readonly #cwd: string;
	readonly #options: WalkOptions;

	constructor(cwd: string, options: WalkOptions) {
		this.#cwd = cwd;
		this.#options = options;

		if (options.defaultFilter === true) {
			utils.assignDefaultFilter(this.#options);
		}

		if (options.depthFilter === true) {
			utils.assignDepthFilter(this.#options);
		}
	}

	async #measure(function_: WalkImplFunction): Promise<void> {
		const matches: string[] = [];

		const timeStart = utils.timeStart();

		await new Promise<void>((resolve, reject) => {
			const stream = function_();

			stream.once('error', (error) => {
				reject(error);
			});
			stream.on('data', (entry: string) => {
				matches.push(entry);
			});
			stream.once('end', () => {
				resolve();
			});
		});

		const count = matches.length;
		const memory = utils.getMemory();
		const time = utils.timeEnd(timeStart);

		bencho.time('time', time);
		bencho.memory('memory', memory);
		bencho.value('entries', count);
	}

	public async measurePreviousVersion(): Promise<void> {
		const walk = await utils.importAndMeasure(utils.importPrevious);
		const settings = new walk.Settings(this.#options);

		await this.#measure(() => walk.walkStream(this.#cwd, settings));
	}

	public async measureCurrentVersion(): Promise<void> {
		const walk = await utils.importAndMeasure(utils.importCurrent);
		const settings = new walk.Settings(this.#options);

		await this.#measure(() => walk.walkStream(this.#cwd, settings));
	}
}

(async () => {
	const args = process.argv.slice(2);

	const impl = args[0] as WalkImplementation;
	const cwd = path.resolve(args[1]!);
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

		// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
		default: {
			throw new TypeError('Unknown implementation');
		}
	}
})();
