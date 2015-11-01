var childProcess = require('child_process');
var filterEmpty = require('./filter-empty');
var stripOuter = require('strip-outer');
var repoPaths = require('./repo-paths');
var config = require('./config');
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
                name: name.split(' ')[0].substring('refs/heads/'.length),
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

function printReport(folderPath, data, upstreamHideMaster, i) {
    var displayBranches = data.branches.filter(function(branch) {
        if (branch.name !== 'master') { return true; }
        if (branch.hasUpstreamChanges && !upstreamHideMaster) { return true; }
        return false;
    });

    if (displayBranches.length || data.localChanges) {
        var output = [(i + ') ' + folderPath).bold];
        if (data.localChanges) {
            output[0] = output[0].green;
        }
        displayBranches.forEach(function(branch) {
            var branchOutput = branch.current ? '*': '';
            branchOutput += branch.name;
            
            if (branch.hasUpstreamChanges) {
                output.push(branchOutput.red);
            } else {
                output.push(branchOutput.yellow);
            }
        });
        console.log(output.join(' '));
        return true;
    }
}

module.exports = function(params, showLast, upstreamHideMaster) {
    var roots;

    // if (params.length) {
    //     config.write('last', params.map(function(param) {
    //         return path.resolve(param);
    //     }));
    // }
    // if (showBookmarks) {
        roots = config.read('bookmarks');
    // } else {
    //     roots = config.read('last');
    // }

    var summary;
    if (!roots.length) {
        summary = '[No repos to report on]';
    } else {
        summary = roots.join(', ');
    }
    console.log(summary.bold.cyan);
    console.log('='.bold.cyan.repeat(summary.length));
    var folders = repoPaths.fromRoots(roots);

    Promise.all(folders.map(function(folder) {
        return report(folder.path);
    }))
    .then(function(results) {
        var printedCount = 1;
        var numbereds = [];
        results.forEach(function(result, i) {
            if (printReport(folders[i].path, result, upstreamHideMaster, printedCount)) {
                numbereds.push(folders[i].path);
                printedCount += 1;
            }
        });
        config.write('numbereds', numbereds);
    })
    .catch(function(ex) {
        console.error('Something went wrong:', ex.stack);
    });
};
