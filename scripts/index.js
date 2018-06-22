#!/usr/bin/env node

const yargs = require('yargs');

yargs.alias('help', 'h');
yargs.alias('version', 'v');

yargs.strict();
yargs.detectLocale(false);
yargs.showHelpOnFail(false, 'Specify --help for available options');

// Commands
require('./commands/package/new');

yargs.parse();
