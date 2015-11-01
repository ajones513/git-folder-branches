var config = require('./config');

module.exports = function() {
    config.read().forEach(function(root) {
        console.log(root);
    });
};