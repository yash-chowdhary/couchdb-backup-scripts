var http = require('http');
var https = require('https');
var cmd = require('node-cmd');

var param = process.argv[2];

var body ='';
var json;
var obj;
var request = https.get("https://manareasedinguallyarthei:546b7799281fc1eb8836d7f509d7cbaac24c375c@vaultdragon.cloudant.com/vaultdragon/_all_docs?include_docs=true",
function(res){
    res.on('data', function(chunk){
        body+=chunk;
        json+=chunk.toJSON();           
    });
    res.on('end',function(){
        body = body.trim();
        // console.log('body: \n'+body);
        var object = JSON.parse(body);
        for(let i=0;i<35;i++){
            if(object.rows[i].id.substring(0,1) != '_'){        //filters out ones that don't have nested databases
                if(object.rows[i].doc.hasOwnProperty('cms')){   //filters out the ones that have cms & dragonfly databases
                    var cmsBackupFileName = object.rows[i].doc.cms.cloudantDatabase.toString()+'.txt';
                    var dragonflyBackupFileName = object.rows[i].doc.dragonfly.cloudantDatabase.toString()+'.txt';
                    
                    var cms_cmdCommand_backup = 'couchbackup --url https://'+ object.rows[i].doc.cms.cloudantUsername + ':' + object.rows[i].doc.cms.cloudantPassword
                    + '@vaultdragon.cloudant.com/ --db ' + object.rows[i].doc.cms.cloudantDatabase + ' > ' + cmsBackupFileName;
                    
                    var dragonfly_cmdCommand_backup = 'couchbackup --url https://'+ object.rows[i].doc.dragonfly.cloudantUsername + ':' + object.rows[i].doc.dragonfly.cloudantPassword
                    + '@vaultdragon.cloudant.com/ --db ' + object.rows[i].doc.dragonfly.cloudantDatabase + ' > ' + dragonflyBackupFileName;

                    console.log(dragonfly_cmdCommand_backup);
                    //call couchbackup                    
                    cmd.get(cms_cmdCommand_backup,function(){
                        console.log('(cmd) backup complete.');
                    })

                    if(i===3){
                        continue;
                    }   else{
                        cmd.get(dragonfly_cmdCommand_backup,function(){
                            console.log('(dragonfly) backup complete.');
                        })   
                    }             
                }   else{
                    
                    var backupFileName = object.rows[i].doc.cloudantDatabase.toString()+'.txt';
                    var cmdCommand_backup = 'couchbackup --url https://'+ object.rows[i].doc.cloudantUsername + ':' + object.rows[i].doc.cloudantPassword
                    + '@vaultdragon.cloudant.com/ --db ' + object.rows[i].doc.cloudantDatabase + ' > ' + backupFileName;
                    
                    //call couchbackup
                    cmd.get(cmdCommand_backup,function(err,data,stderr){
                        console.log('backup complete.');
                    })

                }
            }
        }
    });
})