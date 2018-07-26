import { RunnerResult } from './runner';

export default abstract class Reporter {
	public abstract onStart(): void;
	public abstract onEnd(): void;

	public abstract onGroupStart(name: string): void;
	public abstract onGroupEnd(name: string, result: RunnerResult.Group): void;

	public abstract onRaceStart(name: string): void;
	public abstract onRaceEnd(name: string, result: RunnerResult.Race): void;

	public abstract onRaceIterationStart(index: number): void;
	public abstract onRaceIterationEnd(index: number, result: RunnerResult.RaceIteration): void;
}
