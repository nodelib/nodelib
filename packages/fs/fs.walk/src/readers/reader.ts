import * as common from './common';

import type Settings from '../settings';

export default class Reader {
	constructor(protected readonly _root: string, protected readonly _settings: Settings) {
		this._root = common.replacePathSegmentSeparator(_root, _settings.pathSegmentSeparator);
	}
}
