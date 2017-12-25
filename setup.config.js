var http = require('http');
var https = require('https');
var cmd = require('node-cmd');

var param_username = process.argv[2].toString();
var param_password = process.argv[3].toString();
var param_dbname = process.argv[4].toString();

let apps = [];

var body = '';
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
                    var cms_dbName = object.rows[i].doc.cms.cloudantDatabase.toString();
                    var cms_dbUsername = object.rows[i].doc.cms.cloudantUsername.toString();
                    var cms_dbPassword = object.rows[i].doc.cms.cloudantPassword.toString();
                    var cms_args = param_username+' '+param_password+' '+param_dbname+' '+cms_dbUsername+' '+cms_dbPassword+' '+cms_dbName;

                    var dragonfly_dbName = object.rows[i].doc.dragonfly.cloudantDatabase.toString();
                    var dragonfly_dbUsername = object.rows[i].doc.dragonfly.cloudantUsername.toString();
                    var dragonfly_dbPassword = object.rows[i].doc.dragonfly.cloudantPassword.toString();
                    var dragonfly_args = param_username+' '+param_password+' '+param_dbname+' '+dragonfly_dbUsername+' '+dragonfly_dbPassword+' '+dragonfly_dbName;

                    apps.push({
                        name       : cms_dbName,
                        script     : "run.sh",
                        instances  : 4,
                        args  : cms_args
                    });

                    apps.push({
                        name       : dragonfly_dbName,
                        script     : "run.sh",
                        instances  : 4,
                        args  : dragonfly_args
                    });
                }   else{

                    var dbName = object.rows[i].doc.cloudantDatabase.toString();
                    var dbUsername = object.rows[i].doc.cloudantUsername.toString();
                    var dbPassword = object.rows[i].doc.cloudantPassword.toString();
                    var args = param_username+' '+param_password+' '+param_dbname+' '+dbUsername+' '+dbPassword+' '+dbName;

                    apps.push({
                        name       : dbName,
                        script     : "run.sh",
                        instances  : 4,
                        args  : args
                    });
                }
            }
        }
    });
})

module.exports = apps;