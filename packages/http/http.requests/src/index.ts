import got from 'got';
import { Context } from './types';

const instance = got.extend({
	mutableDefaults: true,
	context: {
		original: true
	},
	handlers: [
		(options, next) => {
			console.dir('handler', { colors: true });

			console.dir(instance.defaults.options.context, { colors: true });
			console.dir(options.context, { colors: true });

			return next(options);
		}
	],
	hooks: {
		init: [
			() => {
				console.dir('init', { colors: true });
			}
		],
		beforeRequest: [
			() => {
				console.dir('request', { colors: true });
			}
		]
	}
});

instance.extend = (...items) => {
	items.unshift(instance);

	const context = items.reduce<Partial<Context>>((result, item) => {
		const value = typeof item === 'function' ? item.defaults.options.context : item.context;

		return { ...result, ...value };
	}, {});

	instance.defaults.options.context = {
		...instance.defaults.options.context,
		...context
	};

	return got.extend(...items, { context });
};

export default instance;
