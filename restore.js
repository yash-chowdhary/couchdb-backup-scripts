var cmd = require('node-cmd');
var http = require('http');
var https = require('https');

var param_username = process.argv[2].toString();
var param_password = process.argv[3].toString();
var param_dbname = process.argv[4].toString();

var body='';
var request = https.get("https://"+param_username+":"+param_password+"@vaultdragon.cloudant.com/"+param_dbname+"/_all_docs?include_docs=true",
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
                    var cmsBackupFileName = 'decrypted_'+object.rows[i].doc.cms.cloudantDatabase.toString()+'.txt';
                    var dragonflyBackupFileName = 'decrypted_'+object.rows[i].doc.dragonfly.cloudantDatabase.toString()+'.txt';
                    
                    var cms_cmdCommand_restore = 'testscript.sh '+cmsBackupFileName+' '+object.rows[i].doc.cms.cloudantDatabase.toString();
                    
                    var dragonfly_cmdCommand_restore = 'testscript.sh '+dragonflyBackupFileName+' '+object.rows[i].doc.dragonfly.cloudantDatabase.toString();

                    console.log(dragonfly_cmdCommand_restore);
                    //call couchbackup                    
                    cmd.get(cms_cmdCommand_restore,function(){
                        console.log('(cms) restore complete: '+object.rows[i].doc.cms.cloudantDatabase);
                    })

                    if(i!=3){
                        cmd.get(dragonfly_cmdCommand_restore,function(){
                            console.log('(dragonfly) restore complete: '+object.rows[i].doc.dragonfly.cloudantDatabase);
                        })   
                    }             
                }   else{
                    
                    var backupFileName = 'decrypted_'+object.rows[i].doc.cloudantDatabase.toString()+'.txt';
                    var cmdCommand_restore = 'testscript.sh '+backupFileName+' '+object.rows[i].doc.cloudantDatabase.toString();
                    
                    //call couchbackup
                    cmd.get(cmdCommand_restore,function(err,data,stderr){
                        console.log('restore complete.');
                    })

                }
            }
        }
    });
})