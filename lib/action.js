var config = require('../lib/config');
var childProcess = require('child_process');

function action(command, path) {
    if (command === 'gfbcd') {
        console.log(path);
        return;
    }

    if (command === 'gp') {
        var output = childProcess.spawn(
            'git',
            ['pull'],
            {cwd: path, stdio: 'inherit'}
        );
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
