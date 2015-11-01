var osenv = require('osenv');
var fs = require('fs');
var base = osenv.home() + '/.git-folder-branches-';

function getPath(slug) {
    return base + slug + '.json';
}

exports.read = function(slug) {
    var path = getPath(slug);
    if (fs.existsSync(path)) {
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    }
    return [];
};

exports.write = function(slug, input) {
    fs.writeFileSync(getPath(slug), JSON.stringify(input));
};
