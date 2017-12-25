var cmd = require('node-cmd');
var http = require('http');
var https = require('https');

var main_param_username = process.argv[2].toString();   //vd account
var main_param_password = process.argv[3].toString();
var main_param_dbname = process.argv[4].toString();
var param_username = process.argv[5].toString();        //nested DBs
var param_password = process.argv[6].toString();
var param_dbname = process.argv[7].toString();

var cmdCommand = 'request_caller.sh '+param_username+' '+param_password+' '+param_dbname;
cmd.get(cmdCommand,function(err,data,stderr){
    console.log('run complete');
    console.log(stderr);
    console.log(err);
});