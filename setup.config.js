var http = require('http');
var https = require('https');
var cmd = require('node-cmd');
var rp = require('request-promise');

module.exports = {
    apps: 
    [{
        name       : 'process 1',
        script     : "cron.js",
        args       : "1"
    },
    {
        name       : 'process 2',
        script     : "cron.js",
        args       : "2"
    },
    {
        name       : 'process 3',
        script     : "cron.js",
        args       : "3"
    },
    {
        name       : 'process 4',
        script     : "cron.js",
        args       : "4"
    }]
}