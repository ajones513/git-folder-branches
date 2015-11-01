#! /usr/bin/env node

// global.start = Date.now();
var args = process.argv.slice(2);
var options = {};
var params = [];

args.filter(function(arg) {
    return arg.indexOf('-') === 0;
}).forEach(function(arg) {
    options[arg.substring(1)] = true;
});

params = args.filter(function(arg) {
    return arg.indexOf('-') !== 0;
});

if (options.a || options.d) {
    require('../lib/update-conf')(options.a, params);
    return;
}

if (options.l) {
    require('../lib/list')();
    return;
}

require('../lib/show')(params);
