#! /usr/bin/env node

// var start = Date.now();
var osenv = require('osenv'),
    fs = require('fs'),
    getDirectories = require('../lib/get-directories'),
    path = require('path'),
    childProcess = require('child_process'),
    stripOuter = require('strip-outer');

require('string.prototype.repeat');
require('colors');

function getStatusLength(path) {
    return new Promise(function(resolve) {
        childProcess.exec('git status --porcelain', {cwd: path}, function(err, stdOut) {
            if (err) {
                throw err;
            }
            resolve(stdOut.split("\n").filter(function(line) { return line.length; }).length);
        });
    });
}

function getBranches(path) {
    return new Promise(function(resolve) {
        childProcess.exec('git for-each-ref --format=\'%(HEAD) %(refname) %(upstream:track)\' refs/heads', {cwd: path}, function(err, stdOut) {
            if (err) {
                throw err;
            }
            resolve(stdOut.split("\n").filter(function(line) { return line.length; }));
        });
    });
}
 
var srcPath = '.';
if (process.argv.length > 2) {
    srcPath = process.argv[2];
}
var folders = getDirectories(srcPath).sort();

function report(dir) {
    return Promise.all([
            getBranches(dir),
            getStatusLength(dir)
        ])
        .then(function(results) {
            // console.log('Time', Date.now() - start);

            var branches = results[0].map(function(branch) {
                return {
                    name: stripOuter(branch, '*').trim(),
                    current: branch.indexOf('*') === 0,
                    hasUpstreamChanges: /\[[^\]]*behind/.test(branch)
                };
            });

            return {
                branches: branches,
                localChanges: results[1]
            };
        });
}

var promises = folders.map(function(folder) {
    var fullDir = path.join(srcPath, folder);
    return report(fullDir)
        .then(function(result) {
            return {
                folder: folder,
                data: result
            };
        });
});

Promise.all(promises)
    .then(function(results) {
        results.forEach(function(result) {
            var folder = result.folder;
            var data = result.data;

            var displayBranches = data.branches.filter(function(branch) {
                if (branch.name !== 'refs/heads/master' && branch.name !== 'master') return true;
                if (branch.hasUpstreamChanges) return true;
                return false;
            });

            if (displayBranches.length || data.localChanges) {
                console.log(folder.bold);
                console.log('='.bold.repeat(folder.length));
                if (data.localChanges) {
                    var plural = data.localChanges > 1 ? 's' : '';
                    console.log((data.localChanges + ' uncommitted change' + plural).green);
                }
                displayBranches.forEach(function(branch) {
                    var output = [];
                    if (branch.current) {
                        output.push('*');
                    }
                    output.push(branch.name);
                    output = output.join(' ');
                    
                    if (branch.hasUpstreamChanges) {
                        console.log(output.red);
                    } else {
                        console.log(output.yellow);
                    }
                });
                console.log();
            }

        });

        var pidFile = osenv.home() + '/.git-folder-branches.pid';
        var lastPid;
        try {
            lastPid = fs.readFileSync(pidFile, 'utf8');
        } catch(ex) {}

        if (lastPid) {
            childProcess.spawn(
                'kill',
                [lastPid],
                {detached: true, stdio: ['ignore', 'ignore', 'ignore']}
            );
        }

        var out = 'ignore'; // fs.openSync('./out.log', 'a');
        var child = childProcess.spawn(
            __dirname + '/fetcher.js',
            [srcPath],
            {detached: true, stdio: ['ignore', out, out]}
        );

        fs.writeFileSync(pidFile, child.pid);
        child.unref();
    })
    .catch(function(ex) {
        console.error('Something went wrong:', ex.stack);
    });
