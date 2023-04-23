import { performance } from 'perf_hooks';

import * as bencho from 'bencho';

import type { Options } from '@nodelib/fs.walk.previous';

export function timeStart(): number {
	return performance.now();
}

export function timeEnd(start: number): number {
	return performance.now() - start;
}

export function getMemory(): number {
	return process.memoryUsage().heapUsed;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export function importCurrent(): Promise<typeof import('..')> {
	return import('..');
}

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export function importPrevious(): Promise<typeof import('@nodelib/fs.walk.previous')> {
	return import('@nodelib/fs.walk.previous');
}

export async function importAndMeasure<T>(function_: () => Promise<T>): Promise<T> {
	const start = timeStart();

	const result = await function_();

	const time = timeEnd(start);

	bencho.time('import.time', time);

	return result;
}

export function assignDefaultFilter(options: Options): void {
	options.deepFilter = (entry) => entry.name !== '.git' && entry.name !== 'node_modules';
	options.entryFilter = (entry) => {
		if (!entry.dirent.isFile()) {
			return true;
		}

		const extname = entry.name.slice(-3);

		return extname === '.js' || extname === '.ts';
	};
}

export function assignDepthFilter(options: Options): void {
	options.deepFilter = (entry) => {
		return entry.path.split('/').length <= 5;
	};
}
