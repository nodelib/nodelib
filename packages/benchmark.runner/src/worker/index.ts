import * as path from 'path';

import { convert } from '@nodelib/benchmark.queue';
import { Worker } from '@nodelib/benchmark.worker';

const ARGUMENTS = process.argv.slice(2);

const MODULE_PATH = path.resolve(ARGUMENTS[0]);
const RACE_INDEX = parseInt(ARGUMENTS[1], 10);

Promise.resolve()
	.then(() => import(MODULE_PATH))
	.then((group) => {
		const queue = convert(group);

		return new Worker(queue).start(RACE_INDEX);
	})
	.catch((error) => {
		console.error(error);

		process.exit(1);
	});
