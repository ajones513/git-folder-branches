var config = require('../lib/config');
var childProcess = require('child_process');

function open(path) {
    childProcess.spawn(
        'open',
        ['-a', 'SourceTree', path],
        {detached: true, stdio: ['ignore', 'ignore', 'ignore']}
    ).unref();
}

function action(command, path) {
    if (command === 'gu') {
        var output = childProcess.spawn(
            'git',
            ['pull'],
            {cwd: path, stdio: 'inherit'}
        );
        return;
    }

    open(path);
}

module.exports = function(command, useIndex, param) {
    if (useIndex) {
        var numbereds = config.read('numbereds');
        var path = numbereds[param - 1];
        if (path !== undefined) {
            action(command, path);
        } else {
            console.log('Invalid index');
        }
        return;
    }

    action(command, param);
};
