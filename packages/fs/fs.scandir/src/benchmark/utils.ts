import { performance } from 'node:perf_hooks';

import * as bencho from 'bencho';

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
export function importPrevious(): Promise<typeof import('@nodelib/fs.scandir.previous')> {
	return import('@nodelib/fs.scandir.previous');
}

export async function importAndMeasure<T>(function_: () => Promise<T>): Promise<T> {
	const start = timeStart();

	const result = await function_();

	const time = timeEnd(start);

	bencho.time('import.time', time);

	return result;
}
