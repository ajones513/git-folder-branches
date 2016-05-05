var config = require('../lib/config');
var childProcess = require('child_process');
var Promise = require('bluebird');
require('colors');

function createGp(path) {
    return new Promise(function(resolve) {
        console.log(('git pull ' + path).bold);
        var gp = childProcess.spawn(
            'git',
            ['pull'],
            {cwd: path, stdio: 'inherit'}
        );

        gp.on('close', resolve);
    });
}

function action(command, path) {
    if (command === 'gfbcd') {
        console.log(path);
        return;
    }

    if (command === 'gp') {
        childProcess.spawn(
            'git',
            ['pull'],
            {cwd: path, stdio: 'inherit'}
        );
        return;
    }

    if (command === 'gpa') {
        Promise.map(config.read('pullers'), function(puller) {
            return createGp(puller);
        }, {concurrency: 1});
        return;
    }

    if (command === 'gs') {
        childProcess.spawn(
            'open',
            ['-a', 'SourceTree', path],
            {detached: true, stdio: ['ignore', 'ignore', 'ignore']}
        ).unref();
    }
}

module.exports = function(command, useIndex, param) {
    if (useIndex) {
        var numbereds = config.read('numbereds');
        var path = numbereds[param - 1];
        if (path !== undefined) {
            action(command, path);
        } else {
            if (command === 'gfbcd') {
                console.log('.'); // Just stay in the current directory
            } else {
                console.log('Invalid index');
            }
        }
        return;
    }

    action(command, param);
};
