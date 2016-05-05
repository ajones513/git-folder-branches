var childProcess = require('child_process');
var filterEmpty = require('./filter-empty');
var stripOuter = require('strip-outer');
var repoPaths = require('./repo-paths');
var config = require('./config');
var pathUtil = require('path');
require('string.prototype.repeat');
require('colors');

var excludeBranches = config.read('exclude-branches');

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
        childProcess.exec('git for-each-ref --format=\'%(HEAD) %(refname) %(upstream:track)%(upstream)\' refs/heads', {cwd: path}, function(err, stdOut) {
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
                name: name.split(' ')[0].substring('refs/heads/'.length),
                current: branch.indexOf('*') === 0,
                hasUpstreamChanges: branch.indexOf('[') !== -1,
                hasUpstream: name.split(' ').length > 1
            };
        });

        return {
            branches: branches,
            localChanges: results[1]
        };
    });
}

function printReport(folderPath, data, i, command) {
    var displayBranches = data.branches.filter(function(branch) {
        if (command !== 'ga') {
            for (var j = excludeBranches.length - 1; j >= 0; j -= 1) {
                if ((new RegExp(excludeBranches[j])).test(branch.name)) {
                    return false;
                }
            }
        }
        if (branch.name !== 'master') { return true; }
        if (branch.hasUpstreamChanges) { return true; }
        if (!branch.hasUpstream) { return true; }
        if (command === 'ga') { return true; }
        return false;
    });

    if (command === 'ga' || displayBranches.length || data.localChanges) {
        var output = [folderPath.bold + (' (' + i + ')').bold.magenta];
        if (data.localChanges) {
            output[0] = output[0].green;
        }
        displayBranches.forEach(function(branch) {
            var branchOutput = branch.current ? '*': '';
            branchOutput += branch.name;
            
            if (branch.hasUpstreamChanges || !branch.hasUpstream) {
                output.push(branchOutput.red);
            } else {
                output.push(branchOutput.yellow);
            }
        });
        console.log(output.join(' '));
        return true;
    }
}

module.exports = function(params, command) {
    var roots = config.read('bookmarks');

    var mustStartWith;
    if (params.length) {
        if (params[0].replace(/[^0-9]/g, '') === params[0]) {
            mustStartWith = roots[params[0] - 1];
        } else {
            mustStartWith = pathUtil.resolve(params[0]);
        }
    }

    var summary;
    var summaryLength = 0;
    if (!roots.length) {
        summary = '[No repos to report on]';
        summaryLength = summary.length;
        summary = summary.bold.cyan;
    } else {
        summary = roots.map(function(root, i) {
            var num = (i + 1) + ') ';
            summaryLength += (num.length + root.length);
            return num.bold.magenta + root.bold.cyan;
        }).join(' ');
        summaryLength += (roots.length - 1);
    }
    console.log(summary);
    console.log('='.bold.cyan.repeat(summaryLength));
    
    var folders = repoPaths.fromRoots(roots);

    Promise.all(folders.map(function(folder) {
        return report(folder.path);
    }))
    .then(function(results) {
        var printedCount = 1;
        var numbereds = [];
        var pullers = [];
        results.forEach(function(result, i) {
            if (
                (
                    mustStartWith === undefined ||
                    folders[i].path.indexOf(mustStartWith + '/') === 0 ||
                    folders[i].path === mustStartWith
                ) &&
                printReport(folders[i].path, result, printedCount, command)
            ) {
                if (result.branches.some(function(branch) { return branch.current && branch.hasUpstreamChanges; })) {
                    pullers.push(folders[i].path);
                }
                numbereds.push(folders[i].path);
                printedCount += 1;
            }
        });
        config.write('numbereds', numbereds);
        config.write('pullers', pullers);
    })
    .catch(function(ex) {
        console.error('Something went wrong:', ex.stack);
    });
};
