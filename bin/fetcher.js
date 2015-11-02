#!/usr/bin/env node

var childProcess = require('child_process');
var repoPaths = require('../lib/repo-paths');
var config = require('../lib/config');

console.log('Starting fetcher');

var delay = 30000;
var currentIndex = 0;

function fetch() {
    var folders = repoPaths.fromRoots(config.read('bookmarks'));

    if (!folders.length) {
        console.log('Nothing to fetch');
        setTimeout(fetch, delay);
        return;
    }

    if (currentIndex >= folders.length) {
        currentIndex = 0;
    }

    childProcess.exec('git fetch', {cwd: folders[currentIndex].path}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Fetched', folders[currentIndex].path);
        }

        currentIndex += 1;
        setTimeout(fetch, delay);
    });
}

setTimeout(fetch, delay);
