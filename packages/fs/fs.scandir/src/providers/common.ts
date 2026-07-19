export function getPathPrefix(filepath: string, separator: string): string {
	/**
	 * Correctly handles roots (`/`, `C:/`) and UNC paths (`//?/C:/`) that already end with a separator.
	 */
	if (filepath.endsWith(separator)) {
		return filepath;
	}

	return filepath + separator;
}
