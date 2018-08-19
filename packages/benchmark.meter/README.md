# @nodelib/benchmark.meter

> The utilities for work with metrics for [@nodelib/benchmark](../benchmark). See [@nodelib/benchmark](../benchmark) for more information.

## Install

```
$ npm install @nodelib/benchmark.meter
```

## Usage

```js
const { Meter } = require('@nodelib/benchmark.meter');

const meter = new Meter();

meter.time('fill_map_time');
Array(100).fill(0).map((_, index) => index);
meter.time('fill_map_memory');
meter.time('fill_map_time');
meter.common('custom_marker', 1);
```

## Changelog

See the [Releases section of our GitHub project](https://github.com/nodelib/nodelib/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
