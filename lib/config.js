var osenv = require('osenv');
var fs = require('fs');
var bookmarksPath = osenv.home() + '/.git-folder-branches-bookmarks.conf';
var lastPath = osenv.home() + '/.git-folder-branches-last.conf';

exports.readBookmarks = function() {
    if (fs.existsSync(bookmarksPath)) {
        return JSON.parse(fs.readFileSync(bookmarksPath, 'utf8'));
    }
    return [];
};

exports.writeBookmarks = function(input) {
    fs.writeFileSync(bookmarksPath, JSON.stringify(input));
};

exports.readLast = function() {
    if (fs.existsSync(lastPath)) {
        return JSON.parse(fs.readFileSync(lastPath, 'utf8'));
    }
    return [];
};

exports.writeLast = function(input) {
    fs.writeFileSync(lastPath, JSON.stringify(input));
};
