var requestModule = require('./request');
console.log(requestModule.name);
// if(requestModule.isCorrupt === false){
// 	console.log('false');
// }
// else {
// 	console.log('sfs');
// }
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
