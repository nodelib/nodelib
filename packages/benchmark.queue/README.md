# @nodelib/benchmark.queue

> The queue convereter for [@nodelib/benchmark](../benchmark).

## Install

```
$ npm install @nodelib/benchmark.queue
```

## Usage

```js
const converter = require('@nodelib/benchmark.queue');

const group = require('./some.bench');

const queue = converter.convert(group); // [Race, Race]
```

## Changelog

See the [Releases section of our GitHub project](https://github.com/nodelib/nodelib/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
