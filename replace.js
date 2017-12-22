var cmd = require('node-cmd');
var http = require('http');
var https = require('https');

var body='';
var request = https.get("https://manareasedinguallyarthei:546b7799281fc1eb8836d7f509d7cbaac24c375c@vaultdragon.cloudant.com/vaultdragon/_all_docs?include_docs=true",
function(res){
    res.on('data', function(chunk){
        body+=chunk;           
    });
    res.on('end',function(){
        body = body.trim();
        // console.log('body: \n'+body);
        var object = JSON.parse(body);
        for(let i=0;i<35;i++){
            if(object.rows[i].id.substring(0,1) != '_'){        //filters out ones that don't have nested databases
                if(object.rows[i].doc.hasOwnProperty('cms')){   //filters out the ones that have cms & dragonfly databases
                    var cmsBackupFileName_enc = 'encrypted_'+object.rows[i].doc.cms.cloudantDatabase.toString()+'.txt';
                    var dragonflyBackupFileName_enc = 'encrypted_'+object.rows[i].doc.dragonfly.cloudantDatabase.toString()+'.txt';
                    
                    var cmsBackupFileName_dec = 'decrypted_'+object.rows[i].doc.cms.cloudantDatabase.toString()+'.txt';
                    var dragonflyBackupFileName_dec = 'decrypted_'+object.rows[i].doc.dragonfly.cloudantDatabase.toString()+'.txt';
                    // console.log(cmsBackupFileName);
                    
                    var cms_cmdCommand_decrypt = 'openssl aes-128-cbc -d -in '+cmsBackupFileName_enc +' -pass pass:vaultdragon -out '+cmsBackupFileName_dec;
                    // console.log(cms_cmdCommand_replace);
                    cmd.get(cms_cmdCommand_decrypt,function(){
                        //call script that completes replacement
                        cmd.run('replacescript.sh ' + cmsBackupFileName_dec);
                    });
                    
                    if(i!=3){
                        var dragonfly_cmdCommand_decrypt = 'openssl aes-128-cbc -d -in '+dragonflyBackupFileName_enc +' -pass pass:vaultdragon -out '+dragonflyBackupFileName_dec;
                        cmd.get(dragonfly_cmdCommand_decrypt,function(){
                            cmd.run('replacescript.sh ' + dragonflyBackupFileName_dec);
                        });
                    }
                }   else{
                    
                    var backupFileName_enc = 'encrypted_'+object.rows[i].doc.cloudantDatabase.toString()+'.txt';
                    var backupFileName_dec = 'decrypted_'+object.rows[i].doc.cloudantDatabase.toString()+'.txt';

                    var cmdCommand_decrypt = 'openssl aes-128-cbc -d -in '+backupFileName_enc +' -pass pass:vaultdragon -out '+backupFileName_dec;
                    cmd.get(cmdCommand_decrypt,function(err,data,stderr){
                        cmd.run('replacescript.sh ' + backupFileName_dec);
                    });

                }
            }
        }
    });
})