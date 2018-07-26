import { METER_PARTIALS_SEPARATOR, METER_PREFIX } from '../common/meter';
import {
	RACE_EMPTY_METHOD_TIME,
	RACE_ITERATION_MEMORY,
	RACE_ITERATION_SEPARATOR,
	RACE_ITERATION_TIME
} from '../worker/worker';

import { RunnerResult } from './runner';

interface MeterValue {
	name: string;
	value: number;
}

type MeterGroup = MeterValue[];
type MeterRecord = Record<string, number>;

export default class Analyzer {
	public analyze(stdout: string): RunnerResult.Statistic[] {
		const meterLines = this._getMeterLines(stdout);
		const meterValues = this._parseMeterLines(meterLines);
		const meterGroups = this._splitMeterValuesByRaceIteration(meterValues);
		const meterRecords = this._convertMeterGroupsToMeterRecords(meterGroups);

		return this._convertMeterGroupsToStatistic(meterRecords);
	}

	private _getMeterLines(stdout: string): string[] {
		return stdout.split('\n').filter((line) => line.startsWith(METER_PREFIX));
	}

	private _parseMeterLines(lines: string[]): MeterValue[] {
		return lines.map((line) => {
			const partials = line.split(METER_PARTIALS_SEPARATOR);

			const name = partials[1];
			const value = parseInt(partials[2], 10);

			return { name, value };
		});
	}

	private _splitMeterValuesByRaceIteration(values: MeterValue[]): MeterGroup[] {
		const groups: MeterGroup[] = [];

		let latestGroupIndex = 0;

		values.forEach((value) => {
			if (value.name === RACE_ITERATION_SEPARATOR) {
				latestGroupIndex++;

				return;
			}

			if (groups[latestGroupIndex] === undefined) {
				groups[latestGroupIndex] = [value];
			} else {
				groups[latestGroupIndex].push(value);
			}
		});

		return groups;
	}

	private _convertMeterGroupsToMeterRecords(groups: MeterGroup[]): MeterRecord[] {
		return groups.map(this._combineMeterValuesByName);
	}

	private _combineMeterValuesByName(group: MeterGroup): MeterRecord {
		return group.reduce((record, { name, value }) => {
			record[name] = value - (record[name] || 0);

			return record;
		}, {} as MeterRecord);
	}

	private _convertMeterGroupsToStatistic(groups: MeterRecord[]): RunnerResult.Statistic[] {
		return groups.map((group) => {
			const totalTime = group[RACE_ITERATION_TIME] - group[RACE_EMPTY_METHOD_TIME];
			const totalMemory = group[RACE_ITERATION_MEMORY];

			// Drop worker symbols
			delete group[RACE_ITERATION_TIME];
			delete group[RACE_EMPTY_METHOD_TIME];
			delete group[RACE_ITERATION_MEMORY];

			return {
				totalTime,
				totalMemory,
				markers: group
			};
		});
	}
}
