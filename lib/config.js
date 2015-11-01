var osenv = require('osenv');
var fs = require('fs');
var filterEmpty = require('./filter-empty');
var confPath = osenv.home() + '/.git-folder-branches-roots.conf';

exports.read = function() {
    if (fs.existsSync(confPath)) {
        return fs.readFileSync(confPath, 'utf8').split("\n").filter(filterEmpty);
    }
    return [];
};

exports.write = function(data) {
    fs.writeFileSync(confPath, data.join("\n"));
};
