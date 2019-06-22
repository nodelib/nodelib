import Settings from '../settings';
import * as common from './common';

export default class Reader {
	constructor(protected readonly _root: string, protected readonly _settings: Settings) {
		this._root = common.replacePathSegmentSeparator(this._root, this._settings.pathSegmentSeparator);
	}
}
