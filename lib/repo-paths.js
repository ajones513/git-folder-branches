var fs = require('fs'),
    path = require('path'),
    config = require('./config');

function fromRoot(root) {
    return fs.readdirSync(root).filter(function(name) {
        var fullPath = path.join(root, name);
        return fs.statSync(fullPath).isDirectory() && fs.readdirSync(fullPath).indexOf('.git') !== -1;
    }).map(function(name) {
        return {
           name: name,
           path: path.resolve(path.join(root, name))
        };
    });
}

exports.fromRoots = function(roots) {
    var output = [];
    roots.forEach(function(root) {
        output = output.concat(fromRoot(root));
    });
    return output.sort(function(a, b) {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
    });
};

exports.fromConfig = function() {
    return exports.fromRoots(config.read());
};
