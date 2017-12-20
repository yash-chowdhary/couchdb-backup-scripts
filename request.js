var http = require('http');
var https = require('https');
var fs = require('fs');
var cmd = require('node-cmd');

let obj,
    id,
    body_request = '',
    body_source = '',
    body_mydb = '',
    id_string;
var request = https.get("https://hereesightertyreatiumbor:e557bfc9bf02bd35bee9bc613fba15ef432d43a6@vaultdragon.cloudant.com/database_backup_test/_changes?descending=true&limit=1",
                function(res){
                    res.on('data', function (chunk) {
                        //writestream.write(chunk);
                        body_request+=chunk;
                    });
                    res.on('end',function(){
                        // console.log(body);
                        obj = body_request.split('\"');
                        id = obj[obj.indexOf('id')+2];
                        console.log(id);
                    });
                })
setTimeout(function(){
    id_string = id.toString();
    console.log(id_string);
    var request = https.get("https://hereesightertyreatiumbor:e557bfc9bf02bd35bee9bc613fba15ef432d43a6@vaultdragon.cloudant.com/database_backup_test/"+ id_string,
    function(res){
        res.on('data', function (chunk) {
            body_source+=chunk;
        });
        res.on('end',function(){
            body_source = body_source.trim();
            // console.log('body_source = '+body_source);
            callFunction();
        })
    })
},2000);

function callFunction(){
    var command = 'curl -X GET http://localhost:5984/test_db_3/'+id_string;
    cmd.get(command,function(err, data, stderr){
        // console.log(data);
        body_mydb+=data;
        body_mydb = body_mydb.trim();
        // console.log('body_mydb = '+body_mydb);
        if(body_mydb === body_source){
            // console.log(isCorrupt);
            
            var AWS = require('aws-sdk'),
            fs = require('fs');
            var param = process.argv[2];
            
            
            AWS.config.update({ accessKeyId: 'AKIAJRZBGKXVR2IIOENA', secretAccessKey: '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' });
            
            var fileStream = fs.createReadStream(param);
            fileStream.on('error', function (err) {
            if (err) { throw err; }
            });  
            fileStream.on('open', function () {
                var s3 = new AWS.S3();
                s3.putObject({
                    Bucket: 'vd-cms-backup',
                    Key: param,
                    Body: fileStream
                }, function (err) {
                    if (err) { 
                        throw err; 
                    }	else{
                        console.log("upload complete.");
                    }
                });
            });
            
        }   else{
            // let isCorrupt = true;
            // module.exports.isCorrupt = true;
            console.log("isCorrupt");
        }
    });
}