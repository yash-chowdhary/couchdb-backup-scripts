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
                    var cms_username = object.rows[i].doc.cms.cloudantUsername;
                    var cms_password = object.rows[i].doc.cms.cloudantPassword;
                    var cms_database = object.rows[i].doc.cms.cloudantDatabase;
                    var cms_cmdCommand = 'request_caller.sh '+cms_username+' '+cms_password+' '+cms_database;
                    cmd.get(cms_cmdCommand,function(err,data,stderr){
                        console.log('run complete');
                        console.log(stderr);
                        console.log(err);
                    });

                    if(i!=3){
                        var dragonfly_username = object.rows[i].doc.dragonfly.cloudantUsername;
                        var dragonfly_password = object.rows[i].doc.dragonfly.cloudantPassword;
                        var dragonfly_database = object.rows[i].doc.dragonfly.cloudantDatabase;
                        var dragonfly_cmdCommand = 'request_caller.sh '+dragonfly_username+' '+dragonfly_password+' '+dragonfly_database;
                        cmd.get(dragonfly_cmdCommand,function(err,data,stderr){
                            console.log('run complete');
                            console.log(stderr);
                            console.log(err);
                        });
                    }
                }   else{
                    var username = object.rows[i].doc.cloudantUsername;
                    var password = object.rows[i].doc.cloudantPassword;
                    var database = object.rows[i].doc.cloudantDatabase;
                    var cmdCommand = 'request_caller.sh '+username+' '+password+' '+database;
                    cmd.get(cmdCommand,function(err,data,stderr){
                        console.log('run complete');
                        console.log(stderr);
                        console.log(err);
                    });
                }
            }
        }
    });
})