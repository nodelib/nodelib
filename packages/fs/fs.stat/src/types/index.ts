import type * as fs from 'node:fs';

export type Stats = fs.Stats;
export type ErrnoException = NodeJS.ErrnoException;
export type AsyncCallback = (error: ErrnoException | null, stats: Stats) => void;
