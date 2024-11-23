import * as util from 'node:util';

import { stat as statCallback } from './stat';

export const stat = util.promisify(statCallback);
