var childProcess = require('child_process');
var filterEmpty = require('./filter-empty');
var stripOuter = require('strip-outer');
var repoPaths = require('./repo-paths');
var config = require('./config');
var path = require('path');
require('string.prototype.repeat');
require('colors');

function getStatusLength(path) {
    return new Promise(function(resolve) {
        childProcess.exec('git status --porcelain', {cwd: path}, function(err, stdOut) {
            if (err) {
                throw err;
            }
            resolve(stdOut.split("\n").filter(filterEmpty).length);
        });
    });
}

function getBranches(path) {
    return new Promise(function(resolve) {
        childProcess.exec('git for-each-ref --format=\'%(HEAD) %(refname) %(upstream:track)\' refs/heads', {cwd: path}, function(err, stdOut) {
            if (err) {
                throw err;
            }
            resolve(stdOut.split("\n").filter(filterEmpty));
        });
    });
}

function report(path) {
    return Promise.all([
        getBranches(path),
        getStatusLength(path)
    ])
    .then(function(results) {
        // console.log('Time', Date.now() - global.start);

        var branches = results[0].map(function(branch) {
            var name = stripOuter(branch, '*').trim();
            return {
                name: name,
                nameNoUpstream: name.split(' ')[0],
                current: branch.indexOf('*') === 0,
                hasUpstreamChanges: branch.indexOf('[') !== -1
            };
        });

        return {
            branches: branches,
            localChanges: results[1]
        };
    });
}

function printReport(folderName, data, upstreamShowMaster) {
    var displayBranches = data.branches.filter(function(branch) {
        if (branch.nameNoUpstream !== 'refs/heads/master' && branch.nameNoUpstream !== 'master') { return true; }
        if (branch.hasUpstreamChanges && upstreamShowMaster) { return true; }
        return false;
    });

    if (displayBranches.length || data.localChanges) {
        console.log(folderName.bold);
        console.log('='.bold.repeat(folderName.length));
        if (data.localChanges) {
            console.log('Uncommitted changes'.green);
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
}

module.exports = function(params, showBookmarks, upstreamShowMaster) {
    var roots;

    if (showBookmarks) {
        roots = config.readBookmarks();
    } else {
        if (params.length) {
            config.writeLast(params.map(function(param) {
                return path.resolve(param);
            }));
        }
        roots = config.readLast();
    }

    console.log(roots.join(', ').bold.cyan);
    console.log('='.bold.cyan.repeat(100));
    var folders = repoPaths.fromRoots(roots);

    Promise.all(folders.map(function(folder) {
        return report(folder.path);
    }))
    .then(function(results) {
        results.forEach(function(result, i) {
            printReport(folders[i].name, result, upstreamShowMaster);
        });
    })
    .catch(function(ex) {
        console.error('Something went wrong:', ex.stack);
    });
};
