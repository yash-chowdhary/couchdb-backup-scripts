var http = require('http');
var https = require('https');
var fs = require('fs');
var cmd = require('node-cmd');

var id;
var body_request = '';
var body_source = '';
var body_mydb = '';
var id_string='';
var fileName;

var param_username = process.argv[2].toString();
var param_password = process.argv[3].toString();
var param_dbname = process.argv[4].toString();
var portNumber = process.argv[5].toString();

var request = https.get("https://"+param_username+":"+param_password+"@vaultdragon.cloudant.com/"+param_dbname+"/_changes?descending=true&limit=1",
                function(res){
                    res.on('data', function (chunk) {
                        body_request+=chunk.toString();
                    });
                    res.on('end',function(){
                        body_request = body_request.trim();
                        // console.log(body_request);
                        var object = JSON.parse(body_request);
                        console.log(object);
                        id = object.results[0].id;
                        callFunction1();
                    });
                })
                
function callFunction1(){
    id_string = id.toString();
    console.log(id_string);
    var request = https.get("https://"+param_username+":"+param_password+"@vaultdragon.cloudant.com/"+param_dbname+"/"+ id_string,
    function(res){
        res.on('data', function (chunk) {
            body_source+=chunk;
        });
        res.on('end',function(){
            body_source = body_source.trim();
            var json_source = JSON.parse(body_source);
            console.log(json_source);
            callFunction(json_source);
        });
    })
}


function callFunction(json_source){
    var command = 'curl -X GET http://localhost:'+portNumber+'/'+param_dbname+'/'+id_string;
    console.log(command);
    cmd.get(command,function(err, data, stderr){
        body_mydb=data.toString();
        body_mydb = body_mydb.trim();
        var json_local = JSON.parse(body_mydb);
        fileName = 'encrypted_'+param_dbname+'.txt';

        if(JSON.stringify(json_local) ===JSON.stringify(json_source)){
            
            // var AWS = require('aws-sdk'),
            // fs = require('fs');
            
            // var fileName = param_dbname+'.txt';

            
            // AWS.config.update({ accessKeyId: 'AKIAJRZBGKXVR2IIOENA', secretAccessKey: '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' });
            
            // var fileStream = fs.createReadStream(fileName);
            // var fileStream1 = fs.createWriteStream('log.txt', {'flags': 'a'});
            // console.log('testing.')
            // fileStream.on('error', function (err) {
            // if (err) { 
            //     fileStream1.end("isCorrupt. Not uploaded onto AWS(error-on): "+param_dbname+'.txt\n'); 
            //     throw err; }
            // });  
            // fileStream.on('open', function () {
            //     var s3 = new AWS.S3();
            //     s3.putObject({
            //         Bucket: 'vd-cms-backup',
            //         Key: fileName,
            //         Body: fileStream
            //     }, function (err) {
            //         if (err) { 
            //             console.log("isCorrupt. Not uploaded onto AWS: "+param_dbname+'.txt');
            //             fileStream1.end("isCorrupt. Not uploaded onto AWS(mostly due to timeout): "+param_dbname+'.txt\n'); 
            //             throw err;
            //         }	else{
            //             fileStream1.end("upload complete: "+param_dbname+'.txt\n');
            //             console.log("upload complete: "+param_dbname+'.txt');
            //         }
            //     });
            // });
            // fileName = 'encrypted_'+param_dbname+'.txt';
            var cmdCommand = 'uploader.sh '+fileName;
            cmd.get(cmdCommand,function(){
                console.log("complete: "+fileName);
            });
                        
        }   else{
            console.log("isCorrupt. Not uploaded onto AWS: "+fileName);
            // fileStream1.end("isCorrupt. Not uploaded onto AWS: "+param_dbname+'.txt\n');
        }
    });
}
