import quantile = require('compute-quantile');

import { NSGroup, Race } from '@nodelib/benchmark.client';

const MEDIAN_AS_QUANTILE = 0.5;

export namespace NSResultBox {
	export type Launch = Iteration[];

	export interface Iteration {
		totalTime: number;
		markers: MarkersDict;
	}

	export type MarkersDict = Record<string, number>;
}

export default class ResultBox {
	private readonly _launches: NSResultBox.Launch[] = [];

	constructor(private readonly _race: Race, private readonly _settings: NSGroup.StrictSettings) { }

	public get race(): Race {
		return this._race;
	}

	public get settings(): NSGroup.StrictSettings {
		return this._settings;
	}

	public get launches(): NSResultBox.Launch[] {
		return this._launches;
	}

	/**
	 * Returns the index of the current launch.
	 */
	public get currentLaunchIndex(): number {
		return this._launches.length;
	}

	/**
	 * Adds the results of the launch in the box.
	 */
	public addLaunch(launch: NSResultBox.Launch): void {
		this._launches.push(launch);
	}

	/**
	 * Returns the median value for each parameter in the results among all the launches.
	 */
	public get medianOfLaunches(): NSResultBox.Launch {
		const launch: NSResultBox.Launch = [];

		for (let index = 0; index < this._launches[0].length; index++) {
			const iterations = this._getIterationsFromLaunchesByIndex(index);

			const totalTime = this._computeMedian(iterations.map((iteration) => iteration.totalTime));
			const markers = this._computeMedianForMarkers(iterations.map((iteration) => iteration.markers));

			launch.push({ totalTime, markers });
		}

		return launch;
	}

	private _getIterationsFromLaunchesByIndex(iterationIndex: number): NSResultBox.Iteration[] {
		const iterations: NSResultBox.Iteration[] = [];

		for (const launch of this._launches) {
			const iteration = launch[iterationIndex];

			iterations.push(iteration);
		}

		return iterations;
	}

	private _computeMedian(array: number[]): number {
		/**
		 * If the number of array elements is even, the median is the average between the central elements.
		 * Since nanoseconds act as units of time, we can not use fractional numbers.
		 */
		return Math.round(quantile(array, MEDIAN_AS_QUANTILE));
	}

	private _computeMedianForMarkers(markers: NSResultBox.MarkersDict[]): NSResultBox.MarkersDict {
		return Object.keys(markers[0]).reduce((result, markerKey) => {
			result[markerKey] = this._computeMedian(markers.map((marker) => marker[markerKey]));

			return result;
		}, {} as NSResultBox.MarkersDict);
	}
}
