# Contributing to @nodelib

Welcome, and thank you for your interest in contributing to **@nodelib**!

Please note that this project is released with a [Contributor Code of Conduct](CODE-OF-CONDUCT.md). By participating in this project you agree to abide by its terms.

## Contribution Guideline

There are a couple of ways you can contribute to this repository:

* **Ideas, feature requests and bugs**: We are open to all ideas and we want to get rid of bugs! Use the [Issues section](https://github.com/nodelib/nodelib/issues) to either report a new issue, provide your ideas or contribute to existing threads.
* **Documentation**: Found a typo or strangely worded sentences? Submit a PR!
* **Code**: Contribute bug fixes, features or design changes.

### Creating an Issue

Before you create a new Issue:

* Check the [Issues](https://github.com/nodelib/nodelib/issues) on GitHub to ensure one doesn't already exist.
* Clearly describe the issue, including the steps to reproduce the issue.

If you find your issue already exists, make relevant comments and add your [reaction](https://github.com/blog/2119-add-reactions-to-pull-requests-issues-and-comments). Use a reaction in place of a "+1" comment:

* 👍 - upvote
* 👎 - downvote

### Making Changes

#### Getting Started

* Install [Node.js](https://nodejs.org/en/).
* Fork the project and clone the fork repository. ([how to create fork?](https://help.github.com/articles/fork-a-repo/#fork-an-example-repository)).
* Create a topic branch from the master branch.
* Run `npm install` to install dependencies for all packages.

#### Setup

> 📖 Only `npm` is supported for working with this repository. Problems with other package managers will be ignored.

```console
git clone https://github.com/nodelib/nodelib
cd nodelib
npm install
```

Then you can either run:

```console
npm run build
```

For make changes, run the watch:

```console
npx lerna run watch --scope=@nodelib/PACKAGE_NAME --stream
```

To run tests in only one package:

```console
npx lerna run test --scope=@nodelib/PACKAGE_NAME --stream
```

To run tests in all packages:

```console
npm run test
```

#### Commit

Keep git commit messages clear and appropriate. You can use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
