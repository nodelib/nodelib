import * as path from 'node:path';

import * as bencho from 'bencho';

import * as utils from '../utils';

import type { Readable } from 'node:stream';
import type { Options } from '@nodelib/fs.walk.previous';

type WalkImplementation = 'current' | 'previous';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WalkImplFunction = (...args: any[]) => Readable;

interface WalkOptions extends Options {
	defaultFilter?: boolean;
	depthFilter?: boolean;
}

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

	async #measure(function_: WalkImplFunction): Promise<void> {
		const matches: string[] = [];

		const timeStart = utils.timeStart();

		await new Promise<void>((resolve, reject) => {
			const stream = function_();

			stream.once('error', (error) => {
				reject(error);
			});
			stream.on('data', (entry: string) => matches.push(entry));
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
