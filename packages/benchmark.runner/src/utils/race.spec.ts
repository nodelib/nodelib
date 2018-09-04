import * as assert from 'assert';

import * as utils from './race';

import { Group, NSGroup, Race } from '@nodelib/benchmark.client';

function makeSettings(general?: NSGroup.Settings, settings?: NSGroup.Settings): NSGroup.StrictSettings {
	return Object.assign({
		iterationCount: 1,
		launchCount: 1,
		parallel: 1,
		warmupCount: 1
	} as NSGroup.StrictSettings, general, settings);
}

describe('Utils → Race', () => {
	describe('.getGroups', () => {
		it('should return empty array when group is undefined', () => {
			const race = new Race('title', () => undefined);

			const expected: Group[] = [];

			const actual = utils.getGroups(race);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return array of groups', () => {
			const race = new Race('title', () => undefined);
			const nested = new Group('Nested', [race]);
			const parent = new Group('Parent', [nested]);

			const expected = [parent, nested];

			const actual = utils.getGroups(race);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.getSettings', () => {
		it('should return settings for race with only one parent group', () => {
			const race = new Race('title', () => undefined);
			const group = new Group('Parent', [race], {
				iterationCount: 1,
				launchCount: 1,
				parallel: 1,
				warmupCount: 1
			});

			const expected: NSGroup.Settings = makeSettings(group.settings);

			const actual = utils.getSettings(race);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return settings for race with nested groups', () => {
			const race = new Race('title', () => undefined);
			const nested = new Group('Nested', [race], { iterationCount: 2 });
			const group = new Group('Parent', [nested], {
				iterationCount: 1,
				launchCount: 1,
				parallel: 1,
				warmupCount: 1
			});

			const expected: NSGroup.Settings = makeSettings(group.settings, { iterationCount: 2 });

			const actual = utils.getSettings(race);

			assert.deepStrictEqual(actual, expected);
		});
	});
});
