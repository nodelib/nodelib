/**
 * An error to be thrown when the request is aborted by AbortController.
*/
export class AbortError extends Error {
	constructor(message: string = 'This operation was aborted.') {
		super(message);

		this.name = 'AbortError';

		Error.captureStackTrace(this, this.constructor);
	}
}
