import got from 'got';

import * as hooks from './hooks';

const instance = got.extend({
	hooks: {
		/**
		 * We use this hook to fill the request context and assign a unique id for request.
		 */
		init: [
			hooks.init.create()
		]
	}
});

export default instance;
