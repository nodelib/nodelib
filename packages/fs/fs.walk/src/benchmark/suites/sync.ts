import * as path from 'node:path';

import * as bencho from 'bencho';

import * as utils from '../utils';

import type { Options } from '@nodelib/fs.walk.previous';

type WalkImplementation = 'current' | 'native' | 'previous';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WalkImplFunction = (...args: any[]) => unknown[];

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

		this.#measure(() => walk.walkSync(this.#cwd, settings));
	}

	public async measureCurrentVersion(): Promise<void> {
		const walk = await utils.importAndMeasure(utils.importCurrent);
		const settings = new walk.Settings(this.#options);

		this.#measure(() => walk.walkSync(this.#cwd, settings));
	}

	public async measureNative(): Promise<void> {
		const fs = await utils.importAndMeasure(() => import('node:fs'));

		this.#measure(() => {
			const dirents = fs.readdirSync(this.#cwd, {
				withFileTypes: true,
				recursive: true,
			});

			const hasDeepFilter = this.#options.deepFilter !== undefined;
			const hasEntryFilter = this.#options.entryFilter !== undefined;

			return dirents.filter((dirent) => {
				if (hasDeepFilter && dirent.isDirectory()) {
					return dirent.name !== '.git' && dirent.name !== 'node_modules';
				}

				if (hasEntryFilter && dirent.isFile()) {
					const extname = dirent.name.slice(-3);

					return extname === '.js' || extname === '.ts';
				}

				return true;
			});
		});
	}

	#measure(function_: WalkImplFunction): void {
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

		case 'native': {
			await walk.measureNative();
			break;
		}

		default: {
			throw new TypeError('Unknown implementation');
		}
	}
})();
