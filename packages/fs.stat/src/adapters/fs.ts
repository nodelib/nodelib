import * as fs from 'fs';

export default abstract class FileSystem<T> {
	public abstract lstat(path: fs.PathLike): T;
	public abstract stat(path: fs.PathLike): T;
}

export class FileSystemSync extends FileSystem<fs.Stats> {
	public lstat(path: fs.PathLike): fs.Stats {
		return fs.lstatSync(path);
	}

	public stat(path: fs.PathLike): fs.Stats {
		return fs.statSync(path);
	}
}

export class FileSystemAsync extends FileSystem<Promise<fs.Stats>> {
	public lstat(path: fs.PathLike): Promise<fs.Stats> {
		return new Promise((resolve, reject) => {
			fs.lstat(path, (err: NodeJS.ErrnoException, stats: fs.Stats) => err ? reject(err) : resolve(stats));
		});
	}

	public stat(path: fs.PathLike): Promise<fs.Stats> {
		return new Promise((resolve, reject) => {
			fs.stat(path, (err: NodeJS.ErrnoException, stats: fs.Stats) => err ? reject(err) : resolve(stats));
		});
	}
}
