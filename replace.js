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
                    var cmsBackupFileName = object.rows[i].doc.cms.cloudantDatabase.toString()+'.txt';
                    var dragonflyBackupFileName = object.rows[i].doc.dragonfly.cloudantDatabase.toString()+'.txt';
                    
                    var cms_cmdCommand_replace = 'powershell -Command \"(gc '+cmsBackupFileName+') -replace \'\"_attachments\"\', \'\"$attachments\"\' | Out-File -encoding ASCII '+cmsBackupFileName+'\"';
                    cmd.get(cmdCommand_replace,function(){
                        console.log('(cmd) replacement complete.');
                    });
                    
                    if(i===3){
                        continue;
                    } else{
                        var dragonfly_cmdCommand_replace = 'powershell -Command \"(gc '+dragonflyBackupFileName+') -replace \'\"_attachments\"\', \'\"$attachments\"\' | Out-File -encoding ASCII '+dragonflyBackupFileName+'\"';
                        cmd.get(dragonfly_cmdCommand_replace,function(){
                            console.log('(dragonfly) replacement complete.');
                        });
                    }
                
                }   else{
                    
                    var backupFileName = object.rows[i].doc.cloudantDatabase.toString()+'.txt';

                    var cmdCommand_replace = 'powershell -Command \"(gc '+backupFileName+') -replace \'\"_attachments\"\', \'\"$attachments\"\' | Out-File -encoding ASCII '+backupFileName+'\"';
                    cmd.get(cmdCommand_replace,function(err,data,stderr){
                        console.log('replacement complete.');
                    });

                }
            }
        }
    });
})