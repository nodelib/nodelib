import type * as fs from 'node:fs';

export type Stats = fs.Stats;
export type ErrnoException = NodeJS.ErrnoException;
// Node-style callbacks report successful completion with null.
// eslint-disable-next-line @typescript-eslint/no-restricted-types
export type AsyncCallback = (error: ErrnoException | null, stats: Stats) => void;
