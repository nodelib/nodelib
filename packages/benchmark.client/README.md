# @nodelib/benchmark.client

> A «client» side code for [@nodelib/benchmark](../benchmark). See [@nodelib/benchmark](../benchmark) for more information.

## Install

```
$ npm install @nodelib/benchmark.client
```

## Usage

```js
const { Client } = require('@nodelib/benchmark.client');

const bench = new Client();

bench.suite('Array', [
	bench.group('flatten', [
		bench.before(() => console.log('Before Hook'));

		bench.race('Array.flatten', () => /* ... */),
		bench.race('_.flatten', () => /* ... */),

		// ...
	], { parallel: 3 });
], {
	warmupCount: 10,
	launchCount: 100,
	iterationCount: 10000,
	parallel: 1
});
```

## Changelog

See the [Releases section of our GitHub project](https://github.com/nodelib/nodelib/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
