# @nodelib/fs.scandir

> List files and directories inside the specified path.

## :bulb: Highlights

The package is aimed at obtaining information about entries in the directory.

  * :dart: Filter system.
  * :gear: Ready for the future development of Node.js ([#15699](https://github.com/nodejs/node/issues/15699)).

## Install

```
$ npm install @nodelib/fs.scandir
```

## Usage

```js
const fsScandir = require('@nodelib/fs.scandir');

fsScandir.scandir('root').then((entries) => {
    console.log(entries); // => [{ name: 'name', path: 'root/name', ino: 0, is... }]
});
```

## API

### fsScandir.scandir(path, [options])

Returns a [`Promise<DirEntry[]>`](#direntry-interface) for provided path.

### fsScandir.scandirSync(path, [options])

Returns a [`DirEntry[]`](#direntry-interface) for provided path.

### fsScandir.scandirCallback(path, [options], callback)

Returns a [`DirEntry[]`](#direntry-interface) for provided path with standard callback-style.

#### path

  * Type: `string | Buffer | URL`

The path to scan.

#### options

  * Type: `Object`

See [options](#options-1) section for more detailed information.

## Options

### stats

  * Type: `boolean`
  * Default: `false`

Include information ([`fs.Stats`](https://nodejs.org/dist/latest/docs/api/fs.html#fs_class_fs_stats)) about the file or not.

### followSymlinks

  * Type: `boolean`
  * Default: `true`

Please, take a look at description inside the [`fs.stat`](https://github.com/nodelib/nodelib/tree/master/packages/fs.stat#followsymlinks) package.

### throwErrorOnBrokenSymlinks

  * Type: `boolean`
  * Default: `false`

Please, take a look at description inside the [`fs.stat`](https://github.com/nodelib/nodelib/tree/master/packages/fs.stat#throwerroronbrokensymlinks) package.

### preFilter

  * Type: `Function` (`(name: string, path: string) => boolean`)
  * Default: `null`

Name- and Path-based entries filter.

### filter

  * Type: `Function` (`(entry: DirEntry) => boolean`)
  * Default: `null`

[`DirEntry`](#direntry-interface)-based entries filter.

### sort

  * Type: `Function` (`(a: DirEntry, b: DirEntry) => number`)
  * Default: `null`

Sort entries on the basis of [`DirEntry`](#direntry-interface). Uses the standard [`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) method.

### fs

  * Type: `FileSystemAdapter`
  * Default: `built-in FS methods`

By default, the built-in Node.js module (`fs`) is used to work with the file system. You can replace each method with your own.

```ts
interface FileSystemAdapter {
	lstat?: typeof fs.lstat,
	stat?: typeof fs.stat,
	lstatSync?: typeof fs.lstatSync,
	statSync?: typeof fs.statSync,
	readdir?: typeof fs.readdir,
	readdirSync?: typeof fs.readdirSync
}
```

## `DirEntry` interface

Please, take a look at [`types/entry.ts`](./src/types/entry.ts) file.

## Changelog

See the [Releases section of our GitHub project](https://github.com/nodelib/nodelib/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
