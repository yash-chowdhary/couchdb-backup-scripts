var http = require('http');
var https = require('https');
var cmd = require('node-cmd');

var main_param_username = process.argv[2].toString();
var main_param_password = process.argv[3].toString();
var main_param_dbname = process.argv[4].toString();
var param_username = process.argv[5].toString();
var param_password = process.argv[6].toString();
var param_dbname = process.argv[7].toString();

var backupFileName = 'encrypted_'+param_dbname+'.txt';
var cmdCommand_backup = 'couchbackup --url https://'+ param_username + ':' + param_password
+ '@vaultdragon.cloudant.com/ --db ' + param_dbname + ' | openssl aes-128-cbc -pass pass:vaultdragon' + ' > ' + backupFileName;

console.log(cmdCommand_backup);
//call couchbackup
cmd.get(cmdCommand_backup,function(err,data,stderr){
    console.log('backup complete: '+param_dbname);
});