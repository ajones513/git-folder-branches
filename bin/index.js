#!/usr/bin/env node

// global.start = Date.now();
var args = process.argv.slice(2);
var options = {};
var params = [];

var command = process.argv[1].split('/');
command = command[command.length - 1];

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

if (params.length && ['gp', 'gs', 'gfbcd'].indexOf(command) !== -1) {
    require('../lib/action')(
        command,
        params[0].replace(/[^0-9]/g, '') === params[0],
        params[0]
    );
    return;
}

require('../lib/show')(params, options.b, options.u, command);
