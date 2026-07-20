import * as util from 'node:util';
import { scandir as scandirCallback } from './scandir.js';

export const scandir = util.promisify(scandirCallback);
