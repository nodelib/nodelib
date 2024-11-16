import cfg from 'eslint-config-mrmlnc';

/** @type {import('eslint').Linter.Config[]} */
const overrides = [
	...cfg.build({}),
	{
		name: 'overrides',
		rules: {
			// https://github.com/benmosher/eslint-plugin-import/issues/1174
			// https://github.com/benmosher/eslint-plugin-import/issues/1214
			'import/no-extraneous-dependencies': 'off',
		},
	},
];

export default overrides;
