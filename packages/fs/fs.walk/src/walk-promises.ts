import * as util from 'node:util';

import { walk as walkCallback } from './walk';

export const walk = util.promisify(walkCallback);
