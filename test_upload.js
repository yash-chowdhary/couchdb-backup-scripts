var AWS = require('aws-sdk'),
fs = require('fs');
var param = process.argv[2];

var datetime = require('node-datetime');
var dt = datetime.create();
var formatted = dt.format('d-m-Y||H:M:S').toString();

// var unique = require('node-unique');
// console.log(unique());

var db_name = ''; 
db_name += param.substring(0,param.length-4);

var bucketName = 'vd-cms-backup';
var key = db_name+'/'+formatted+'_'+param;
console.log(key); 

// var writestream = fs.createWriteStream('log.txt', {'flags': 'a'});
AWS.config.update({ accessKeyId: 'AKIAJRZBGKXVR2IIOENA', secretAccessKey: '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' });

fs.readFile(param, function(err, data){
    if(err){
        // Handle fail...
        // writestream.end('couldn\'t upload(fail):'+param+'\n');
    }else{
        var s3 = new AWS.S3();
        s3.putObject({
            Bucket: bucketName,
            Key: key,
            Body: data
        }, function(err, data){ 
            if(err){
                // writestream.end('couldn\'t upload:'+param+'\n');
                throw err;
            }
            else{
                console.log('uploaded.');
                // writestream.end('uploaded:'+param+'\n');
            }
        });
    }
})