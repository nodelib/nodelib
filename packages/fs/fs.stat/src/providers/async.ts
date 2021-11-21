import type Settings from '../settings';
import type { ErrnoException, Stats } from '../types';

type FailureCallback = (error: ErrnoException | null) => void;

export type AsyncCallback = (error: ErrnoException | null, stats: Stats) => void;

export function read(path: string, settings: Settings, callback: AsyncCallback): void {
	settings.fs.lstat(path, (lstatError, lstat) => {
		if (lstatError !== null) {
			callFailureCallback(callback, lstatError);
			return;
		}

		if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
			callSuccessCallback(callback, lstat);
			return;
		}

		settings.fs.stat(path, (statError, stat) => {
			if (statError !== null) {
				if (settings.throwErrorOnBrokenSymbolicLink) {
					callFailureCallback(callback, statError);
					return;
				}

				callSuccessCallback(callback, lstat);
				return;
			}

			if (settings.markSymbolicLink) {
				stat.isSymbolicLink = () => true;
			}

			callSuccessCallback(callback, stat);
		});
	});
}

function callFailureCallback(callback: AsyncCallback, error: ErrnoException | null): void {
	(callback as FailureCallback)(error);
}

function callSuccessCallback(callback: AsyncCallback, result: Stats): void {
	callback(null, result);
}
