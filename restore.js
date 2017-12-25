var cmd = require('node-cmd');
var http = require('http');
var https = require('https');

var main_param_username = process.argv[2].toString();
var main_param_password = process.argv[3].toString();
var main_param_dbname = process.argv[4].toString();
var param_username = process.argv[5].toString();
var param_password = process.argv[6].toString();
var param_dbname = process.argv[7].toString();

var backupFileName = 'decrypted_'+param_dbname+'.txt';
var cmdCommand_restore = 'testscript.sh '+backupFileName+' '+param_dbname;

//call couchbackup
cmd.get(cmdCommand_restore,function(err,data,stderr){
    console.log('restore complete.');
});