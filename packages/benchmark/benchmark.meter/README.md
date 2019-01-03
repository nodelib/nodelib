# @nodelib/benchmark.meter

> The reporter/parser of markers of metrics for the [@nodelib/benchmark](../benchmark) package.

## Install

```shell
npm install @nodelib/benchmark.meter
```

## Glossary

A **metric** is a set of numeric or string values that describes the state of an application before and after a some instruction is executed. For example, a metric might describe the execution time of some instruction. A metric consists of one or more *markers*.

A **marker** is a pair of name and value that describes the current state of the application. For example, metric of the execution time of a some instruction will be described by two markers.

## Usage

### Reporter

```js
const { Meter, StdoutReporter } = require('@nodelib/benchmark.meter');

const reporter = new StdoutReporter();
const meter = new Meter(reporter);

meter.time('time_marker');
Array(100).fill(0).map((_, index) => index);
meter.memory('memory_marker');
meter.time('time_marker');

meter.common('common_marker', 'something_text');
```

### Parser

```js
const { StdoutReportParser } = require('@nodelib/benchmark.meter');

const parser = new StdoutReportParser();

const stdout = [
  '__METER__{ "name": "first", "value": 123 }',
  '__METER__{ "name": "second", "value": "some" }'
].join('\n');

const markers = parser.parse(stdout);
// -> [{ name: 'first', value: 123 }, { name: 'second', value: 'some' }]
```

## Custom reporter/parser

You can write your own reporter or parser by implementing the corresponding abstract class:

* [reporter](./src/reporters/index.ts)
* [parser](./src/parsers/index.ts)

## Changelog

See the [Releases section of our GitHub project](https://github.com/nodelib/nodelib/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
