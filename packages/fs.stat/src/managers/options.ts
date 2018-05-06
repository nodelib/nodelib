export interface Options {
	throwErrorOnBrokenSymlinks?: boolean;
	followSymlinks?: boolean;
}

export type StrictOptions = Required<Options>;

export function prepare(options?: Options): StrictOptions {
	return Object.assign<StrictOptions, Options | undefined>({
		throwErrorOnBrokenSymlinks: true,
		followSymlinks: true
	}, options);
}
