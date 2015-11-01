var config = require('./config');
var path = require('path');

module.exports = function(add, params) {
    var existing = {};
    config.read('bookmarks').forEach(function(row) {
        existing[row] = true;
    });

    params.forEach(function(param) {
        var absolute = path.resolve(param);
        if (add) {
            existing[absolute] = true;
        } else {
            delete existing[absolute];
        }
    });

    config.write('bookmarks', Object.keys(existing));
};
