var http = require('http');
var https = require('https');
var cmd = require('node-cmd');
var fs = require('fs');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'testvdragon@gmail.com',
        pass: 'testvdragon!'
    }
});

var main_param_username = process.argv[2].toString();
var main_param_password = process.argv[3].toString();
var main_param_dbname = process.argv[4].toString();
var param_username = process.argv[5].toString();
var param_password = process.argv[6].toString();
var param_dbname = process.argv[7].toString();
var portNumber = process.argv[8].toString();

var promise = new Promise(function(resolve,reject){
    var backupFileName = 'encrypted_'+param_dbname+'.txt';
    var cmdCommand_backup = 'couchbackup --url https://'+ param_username + ':' + param_password
    + '@vaultdragon.cloudant.com/ --db ' + param_dbname + ' | openssl aes-128-cbc -pass pass:vaultdragon' + ' > ' + backupFileName;
    
    console.log(cmdCommand_backup);
    //call couchbackup
    cmd.get(cmdCommand_backup,function(err,data,stderr){
        if(!err){
            console.log('backup complete: '+param_dbname);
            resolve();
        }
        else{
            reject();
        }
    });
}).then(function(resolve){
    var backupFileName_enc = 'encrypted_'+param_dbname+'.txt';
    var backupFileName_dec = 'decrypted_'+param_dbname+'.txt';
    var cmdCommand_decrypt = 'openssl aes-128-cbc -d -in '+backupFileName_enc +' -pass pass:vaultdragon -out '+backupFileName_dec;
    console.log(cmdCommand_decrypt);
    cmd.get(cmdCommand_decrypt,function(err,data,stderr){
        if(!err){
            console.log('decryption complete');
            cmd.run('replacescript.sh ' + backupFileName_dec);
        }
        else{
            reject();
        }
    });
},function(reject){
    
    var mailOptions = {
        from: 'testvdragon@gmail.com',
        to: 'yashchowdhary98@gmail.com',
        subject: 'Backup failed:' + param_dbname,
        text: 'Backup of database \''+param_dbname+'\' failed',
        attachments:    
        {
            filename: param_dbname+'.txt',
            content: fs.createReadStream(param_dbname+'.txt'),            
        }
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    }); 
    console.log('backup failed');
}).then(function(resolve){
    var backupFileName = 'decrypted_'+param_dbname+'.txt';
    var url = 'http://localhost:'+portNumber+'/';
    var cmdCommand_restore = 'testscript.sh '+backupFileName+' '+url+' '+param_dbname;
    
    //call couchrestore
    cmd.get(cmdCommand_restore,function(err,data,stderr){
        // console.log('restore complete.');
        if(!err){
            console.log('restore complete');
            // resolve();
        }
        else{
            reject();
        }
    });
},function(reject){
    console.log('replace (/ decryption) failed')
}).then(function(resolve){
    var cmdCommand = 'request_caller.sh '+param_username+' '+param_password+' '+param_dbname;
    cmd.get(cmdCommand,function(err,data,stderr){
        if(err){
            reject();
        }
    });
},function(reject){
    var mailOptions = {
        from: 'testvdragon@gmail.com',
        to: 'yashchowdhary98@gmail.com',
        subject: 'Restore failed:' + param_dbname,
        text: 'Restore of database \''+param_dbname+'\' failed',
        attachments:    
        {
            filename: param_dbname+'.txt',
            content: fs.createReadStream(param_dbname+'.txt'),             
        }
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    console.log('restore failed');
}).then(function(resolve){
    console.log('all tasks completed');
},function(reject){
    var mailOptions = {
        from: 'testvdragon@gmail.com',
        to: 'yashchowdhary98@gmail.com',
        subject: 'Upload failed:' + param_dbname,
        text: 'Upload of database \''+param_dbname+'\' to AWS S3 failed',
        attachments:    
        {
            filename: param_dbname+'.txt',
            content: fs.createReadStream(param_dbname+'.txt'),  
        }
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    console.log('verification / upload failed');
}); 

function callPromise() {
    return promise;
}

callPromise();