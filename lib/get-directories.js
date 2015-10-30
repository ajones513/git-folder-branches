var fs = require('fs'),
    path = require('path');

module.exports = function(srcPath) {
    return fs.readdirSync(srcPath).filter(function(file) {
        var fullPath = path.join(srcPath, file);
        return fs.statSync(fullPath).isDirectory() && fs.readdirSync(fullPath).indexOf('.git') !== -1;
    });
}

