import * as fs from 'fs';

export type AsyncCallback = (err: NodeJS.ErrnoException | null, stats?: fs.Stats) => void;

export default abstract class FileSystem<T> {
	public abstract lstat(path: fs.PathLike, callback?: AsyncCallback): T;
	public abstract stat(path: fs.PathLike, callback?: AsyncCallback): T;
}

export class FileSystemSync extends FileSystem<fs.Stats> {
	public lstat(path: fs.PathLike): fs.Stats {
		return fs.lstatSync(path);
	}

	public stat(path: fs.PathLike): fs.Stats {
		return fs.statSync(path);
	}
}

export class FileSystemAsync extends FileSystem<void> {
	public lstat(path: fs.PathLike, callback: AsyncCallback): void {
		fs.lstat(path, callback);
	}

	public stat(path: fs.PathLike, callback: AsyncCallback): void {
		fs.stat(path, callback);
	}
}
