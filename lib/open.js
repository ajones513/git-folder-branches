var config = require('../lib/config');
var childProcess = require('child_process');

function open(path) {
    childProcess.spawn(
        'open',
        ['-a', 'SourceTree', path],
        {detached: true, stdio: ['ignore', 'ignore', 'ignore']}
    ).unref();
}

module.exports = function(useIndex, param) {
    if (useIndex) {
        var numbereds = config.read('numbereds');
        var path = numbereds[param - 1];
        if (path !== undefined) {
            open(path);
        } else {
            console.log('Invalid index');
        }
    }

    open(param);
};
