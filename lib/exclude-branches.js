var config = require('./config');

module.exports = function(params) {
    config.write('exclude-branches', params);
};
