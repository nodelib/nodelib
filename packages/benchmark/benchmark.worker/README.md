# @nodelib/benchmark.worker

> A worker that runs iterations of races for [@nodelib/benchmark](../benchmark).

## Install

```
$ npm install @nodelib/benchmark.worker
```

## Usage

```js
const { Race } = require('@nodelib/benchmark.client');
const { Worker } = require('@nodelib/benchmark.worker');

const race = new Race('Some title', () => undefined);

const worker = new Worker([race]);

Promise.resolve().then(() => worker.start(0));
```

## Changelog

See the [Releases section of our GitHub project](https://github.com/nodelib/nodelib/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
