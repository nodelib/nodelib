import type { Settings } from '../settings';
import type { Stats } from '../types';

export async function read(path: string, settings: Settings): Promise<Stats> {
	const lstat = await settings.fs.lstat(path);

	if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
		return lstat;
	}

	try {
		const stat = await settings.fs.stat(path);

		if (settings.markSymbolicLink) {
			stat.isSymbolicLink = () => true;
		}

		return stat;
	} catch (error) {
		if (!settings.throwErrorOnBrokenSymbolicLink) {
			return lstat;
		}

		throw error;
	}
}
