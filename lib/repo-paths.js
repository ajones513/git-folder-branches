var fs = require('fs'),
    path = require('path');

function fromRoot(root) {
    if (fs.existsSync(root + '/.git')) {
        var fullPath = path.resolve(root);
        var fullPathParts = fullPath.split('/');
        return [{
            name: fullPathParts[fullPathParts.length - 1],
            path: fullPath
        }];
    }

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
        if (a.path < b.path) { return -1; }
        if (a.path > b.path) { return 1; }
        return 0;
    });
};
