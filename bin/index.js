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

if (['g', 'ga'].indexOf(command) !== -1 && options.x) {
    require('../lib/exclude-branches')(params);
    return;
}

if (['g', 'ga'].indexOf(command) !== -1 && (options.a || options.d)) {
    require('../lib/update-bookmarks')(options.a, params);
    return;
}

if (['gp', 'gs', 'gfbcd'].indexOf(command) !== -1) {
    var param = params.length ? params[0] : '.';
    require('../lib/action')(
        command,
        param.replace(/[^0-9]/g, '') === param,
        param
    );
    return;
}

require('../lib/show')(params, command);
