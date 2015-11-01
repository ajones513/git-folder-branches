#! /usr/bin/env node

var osenv = require('osenv'),
    fs = require('fs'),
    childProcess = require('child_process');

var out = fs.openSync(osenv.home() + '/.git-folder-branches-daemon.log', 'a');
var child = childProcess.spawn(
    __dirname + '/fetcher.js',
    [],
    {detached: true, stdio: ['ignore', out, out]}
);

child.unref();
