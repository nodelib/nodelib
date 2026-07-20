import * as util from 'node:util';
import { stat as statCallback } from './stat.js';

export const stat = util.promisify(statCallback);
