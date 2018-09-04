# @nodelib/benchmark.runner

> A runner of races for [benchmark](../benchmark).

## Install

```
$ npm install @nodelib/benchmark.runner
```

## Usage

```js
const { Runner } = require('@nodelib/benchmark.runner');
const { Race } = require('@nodelib/benchmark.client');

const race = new Race('Some title', () => undefined);
const runner = new Runner();

Promise.resolve().then(() => runner.start('some.bench.js', [race]));
```

## Changelog

See the [Releases section of our GitHub project](https://github.com/nodelib/nodelib/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
