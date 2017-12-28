var AWS = require('aws-sdk'),
fs = require('fs');
var param = process.argv[2];

// var datetime = require('node-datetime');
// var dt = datetime.create();
// var formatted = dt.format('d-m-Y||H:M:S').toString();

var d = new Date();
var day,
    week,
    month,
    hour,
    minute;
switch(d.getDay()){
    case 0: day = 'Sunday'; 
            break;
    case 1: day = 'Monday'; 
            break;
    case 2: day = 'Tuesday'; 
            break;
    case 3: day = 'Wednesday'; 
            break;
    case 4: day = 'Thursday'; 
            break;
    case 5: day = 'Friday'; 
            break;
    case 6: day = 'Saturday'; 
            break; 
}
switch(d.getMonth()){
    case 0: month = 'Jan'; 
            break;
    case 1: month = 'Feb'; 
            break;
    case 2: month = 'Mar'; 
            break;
    case 3: month = 'Apr'; 
            break;
    case 4: month = 'May'; 
            break;
    case 5: month = 'Jun'; 
            break;
    case 6: month = 'Jul'; 
            break;
    case 7: month = 'Aug'; 
            break;
    case 8: month = 'Sep'; 
            break;
    case 9: month = 'Oct'; 
            break;
    case 10: month = 'Nov'; 
            break;
    case 11: month = 'Dec'; 
            break;
}
week = Math.ceil(d.getDate()/7);
hour = d.getHours();
minute = d.getMinutes();

var db_name = ''; 
db_name += param.substring(10,param.length-4);

var bucketName = 'vd-cms-backup';
var key = db_name+'/'+month+'/'+day+'/'+hour+'/'+minute+'/'+db_name;
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