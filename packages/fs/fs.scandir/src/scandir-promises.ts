import * as util from 'node:util';

import { scandir as scandirCallback } from './scandir';

export const scandir = util.promisify(scandirCallback);
