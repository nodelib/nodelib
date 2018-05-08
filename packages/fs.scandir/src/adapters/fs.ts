import * as fs from 'fs';

import * as fsStat from '@nodelib/fs.stat';

export default abstract class FileSystem<TReaddir, TStat> {
	public abstract readdir(path: fs.PathLike): TReaddir;
	public abstract stat(path: fs.PathLike, options: fsStat.Options): TStat;
}

export class FileSystemSync extends FileSystem<string[], fs.Stats> {
	public readdir(path: fs.PathLike): string[] {
		return fs.readdirSync(path);
	}

	public stat(path: fs.PathLike, options: fsStat.Options): fs.Stats {
		return fsStat.statSync(path, options);
	}
}

export class FileSystemAsync extends FileSystem<Promise<string[]>, Promise<fs.Stats>> {
	public readdir(path: fs.PathLike): Promise<string[]> {
		return new Promise((resolve, reject) => {
			fs.readdir(path, (err: NodeJS.ErrnoException, entries: string[]) => err ? reject(err) : resolve(entries));
		});
	}

	public stat(path: fs.PathLike, options: fsStat.Options): Promise<fs.Stats> {
		return fsStat.stat(path, options);
	}
}
