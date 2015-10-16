#! /usr/bin/env node
var fs = require('fs'),
    path = require('path'),
    Promise = require('bluebird'),
    childProcess = require('child_process');

require('string.prototype.repeat');

function getDirectories(srcPath) {
    return fs.readdirSync(srcPath).filter(function(file) {
        return fs.statSync(path.join(srcPath, file)).isDirectory();
    });
}

function getGitBranches(path) {
    return new Promise(function(resolve) {
        childProcess.exec('git branch', {cwd: path}, function(err, stdOut, stdErr) {
            if (err) {
                throw err;
            }
            resolve(stdOut);
        });
    });
}

var srcPath = '.';
if (process.argv.length > 2) {
    srcPath = process.argv[2];
}
var folders = getDirectories(srcPath);

var promises = folders.map(function(folder) {
    var fullDir = path.join(srcPath, folder);
    return getGitBranches(fullDir)
        .then(function(result) {
            var branches = result.split("\n")
                .map(function(branch) {
                    branch = branch.trim();
                    return branch;
                })
                .filter(function(branch) {
                    if (!branch.length) {
                        return false;
                    }
                    if (branch === 'master' || branch === '* master') {
                        return false;
                    }
                    return true;
                });
            return {folder: folder, branches: branches};
        })
});

Promise.all(promises)
    .then(function(results) {
        resultsWithBranches = results.filter(function(result) {
            return result.branches.length;
        });

        resultsWithBranches.forEach(function(result) {
            console.log(result.folder);
            console.log('='.repeat(result.folder.length));
            result.branches.forEach(function(branch) {
                console.log(branch);
            });
            console.log();
        });
    })
