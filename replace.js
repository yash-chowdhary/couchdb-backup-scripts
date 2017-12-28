var cmd = require('node-cmd');
var http = require('http');
var https = require('https');

var main_param_username = process.argv[2].toString();
var main_param_password = process.argv[3].toString();
var main_param_dbname = process.argv[4].toString();
var param_username = process.argv[5].toString();
var param_password = process.argv[6].toString();
var param_dbname = process.argv[7].toString();

var backupFileName_enc = 'encrypted_'+param_dbname+'.txt';
var backupFileName_dec = 'decrypted_'+param_dbname+'.txt';

var cmdCommand_decrypt = 'openssl aes-128-cbc -d -in '+backupFileName_enc +' -pass pass:vaultdragon -out '+backupFileName_dec;
console.log(cmdCommand_decrypt);
cmd.get(cmdCommand_decrypt,function(err,data,stderr){
    cmd.run('replacescript.sh ' + backupFileName_dec);
});