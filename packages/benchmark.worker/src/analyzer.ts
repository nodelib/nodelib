import { NSMeter } from '@nodelib/benchmark.meter';

import { NSWorker } from './worker';

export namespace NSWorkerAnalyzer {
	export interface Marker {
		label: string;
		type: NSMeter.Type;
		value: number;
	}

	export type MarkerLabelGroup = Record<string, Marker[]>;
	export type MarkerGroup = Marker[];

	export type Result = ResultItem[];
	export type ResultItem = Record<string, number>;
}

export default class WorkerAnalyzer {
	public analyze(stdout: string): NSWorkerAnalyzer.Result {
		const lines = this._getResultLines(stdout);
		const metrics = this._parseMarkerLines(lines);
		const groups = this._groupMarkersByIteration(metrics);

		return this._makeResult(groups);
	}

	private _getResultLines(stdout: string): string[] {
		return stdout.split('\n').filter((line) => line.startsWith(NSMeter.Symbols.Prefix));
	}

	private _parseMarkerLines(lines: string[]): NSWorkerAnalyzer.Marker[] {
		return lines.map((line) => {
			const linePartials = line.split(NSMeter.Symbols.Separator);

			return {
				label: linePartials[1],
				type: parseInt(linePartials[2], 10),
				value: parseFloat(linePartials[3])
			};
		});
	}

	private _groupMarkersByIteration(markers: NSWorkerAnalyzer.Marker[]): NSWorkerAnalyzer.MarkerGroup[] {
		let latestGroupIndex = 0;

		return markers.reduce((groups, marker) => {
			if (marker.label === NSWorker.Symbols.IterationStart) {
				groups[latestGroupIndex] = [];

				return groups;
			}

			if (marker.label === NSWorker.Symbols.IterationEnd) {
				latestGroupIndex++;

				return groups;
			}

			groups[latestGroupIndex].push(marker);

			return groups;
		}, [] as NSWorkerAnalyzer.MarkerGroup[]);
	}

	private _makeResult(groups: NSWorkerAnalyzer.MarkerGroup[]): NSWorkerAnalyzer.Result {
		return groups.map((group) => {
			const map = this._groupMarkersByLabel(group);

			return this._combineGroupMarkerValues(map);
		});
	}

	private _groupMarkersByLabel(markers: NSWorkerAnalyzer.Marker[]): NSWorkerAnalyzer.MarkerLabelGroup {
		return markers.reduce((groups, marker) => {
			if (marker.label in groups) {
				groups[marker.label].push(marker);
			} else {
				groups[marker.label] = [marker];
			}

			return groups;
		}, {} as NSWorkerAnalyzer.MarkerLabelGroup);
	}

	private _combineGroupMarkerValues(markerGroup: NSWorkerAnalyzer.MarkerLabelGroup): NSWorkerAnalyzer.ResultItem {
		return Object.keys(markerGroup).reduce((result, label) => {
			const values = markerGroup[label].map(({ value }) => value);

			const latestValue = values.pop() as number;

			result[label] = latestValue - values.reduce((total, value) => total + value, 0);

			return result;
		}, {} as NSWorkerAnalyzer.ResultItem);
	}
}
