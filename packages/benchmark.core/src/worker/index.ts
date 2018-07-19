import Worker, { WorkerTask } from './worker';

Promise.resolve()
	.then(() => {
		const task = getWorkerTask();
		const worker = new Worker(task);

		return worker.start();
	})
	.catch(() => process.exit());

function getWorkerTask(): WorkerTask {
	const args = process.argv.slice(2);

	return {
		modulePath: args[0],
		groupIndex: parseInt(args[1], 10),
		raceIndex: parseInt(args[2], 10)
	};
}
