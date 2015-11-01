#! /usr/bin/env node

// global.start = Date.now();
var args = process.argv.slice(2);
var options = {};
var params = [];

args.filter(function(arg) {
    return arg.indexOf('-') === 0;
}).forEach(function(arg) {
    arg.substring(1).split('').forEach(function(option) {
        options[option] = true;    
    });
});

params = args.filter(function(arg) {
    return arg.indexOf('-') !== 0;
});

if (options.a || options.d) {
    require('../lib/update-bookmarks')(options.a, params);
    return;
}

if (params.length) {
    require('../lib/open')(
        params[0].replace(/[^0-9]/g, '') === params[0],
        params[0]
    );
    return;
}

require('../lib/show')(params, options.b, options.u);
