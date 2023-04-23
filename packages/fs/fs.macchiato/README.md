# @nodelib/fs.macchiato

> A set of classes for easy testing of built-in structures of FS.

## Install

```
$ npm install @nodelib/fs.macchiato
```

## Usage

```js
import { Stats, Dirent, DirentType } from '@nodelib/fs.macchiato';

const stats = new Stats();
const dirent = new Dirent('file.txt', DirentType.File);
```

## API

### `Stats`

Creates a fake instance of `fs.Stats`. Can accept options to control parameter values.

```js
const stats = new Stats({
	isSymbolicLink: true,
	ino: 3
});
```

### `Dirent`

Creates a fake instance of `fs.Dirent`. Can accept options to control parameter values.

```js
const dirent = new Dirent('file.txt', DirentType.Link);
```

## Changelog

See the [Releases section of our GitHub project](https://github.com/nodelib/nodelib/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
