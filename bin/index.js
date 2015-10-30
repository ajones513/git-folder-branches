#! /usr/bin/env node

var start = Date.now();
var fs = require('fs'),
    path = require('path'),
    childProcess = require('child_process');

require('string.prototype.repeat');
require('colors');

function getDirectories(srcPath) {
    return fs.readdirSync(srcPath).filter(function(file) {
        var fullPath = path.join(srcPath, file);
        return fs.statSync(fullPath).isDirectory() && fs.readdirSync(fullPath).indexOf('.git') !== -1;
    });
}

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
 
var srcPath = '.';
if (process.argv.length > 2) {
    srcPath = process.argv[2];
}
var folders = getDirectories(srcPath).sort();

var Git = require('nodegit');

function report(dir) {
    return Git.Repository.open(dir + '/.git')
        .then(function(repo) {
            return Promise.all([
                    repo.getReferences(Git.Reference.TYPE.LISTALL),
                    repo.getCurrentBranch(),
                    getStatusLength(dir)
                ]);
        })
        .then(function(results) {
            // console.log('Time', Date.now() - start);
            var branches = results[0].filter(function(ref) {
                return !ref.isRemote() && !ref.isTag() && ref.isBranch();
            }).map(function(ref) {
                return {
                    name: ref.name(),
                    ref: ref,
                    current: ref.name() === results[1].name()
                };
            });

            branches.forEach(function(branch) {
                var localOid = branch.ref.target();
                var upstreamRef = Git.Branch.upstream(branch.ref);
                var upstreamOid = upstreamRef ? upstreamRef.target() : null;
                if (upstreamOid && localOid.toString() !== upstreamOid.toString()) {
                    branch.hasUpstreamChanges = true;
                }
            });

            return {
                branches: branches,
                hasLocalChanges: !!results[2]
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

            if (displayBranches.length || data.hasLocalChanges) {
                console.log(folder.bold);
                console.log('='.bold.repeat(folder.length));
                if (data.hasLocalChanges) {
                    console.log('Has uncommitted changes'.green);
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
    })
    .catch(function(ex) {
        console.error('Something went wrong:', ex.stack);
    });
