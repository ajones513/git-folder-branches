#! /usr/bin/env node

console.log('Starting fetcher');

var delay = 60000;

var path = require('path');
var childProcess = require('child_process');
var getDirectories = require('../lib/get-directories');

var folders = getDirectories(process.argv[2]).map(function(folder) {
    return path.join(process.argv[2], folder);
});

var currentIndex = 0;

function fetch() {
    childProcess.exec('git fetch', {cwd: folders[currentIndex]}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Fetched', folders[currentIndex]);
        }

        currentIndex += 1;
        if (currentIndex === folders.length) {
            currentIndex = 0;
        }
        setTimeout(fetch, delay);
    });
}

setTimeout(fetch, delay);
