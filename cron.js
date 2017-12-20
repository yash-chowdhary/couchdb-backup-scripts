var CronJob = require('cron').CronJob;
var cmd = require('node-cmd');

var job = new CronJob('*/1 * * * *',function(){
    console.log("running now...");
    cmd.get('script.sh backup_test.txt', function(err,data,stderr){
        console.log(data);
    });
},
function(){
    console.log("job completed");
},true,'Asia/Hong_Kong');

console.log('status: '+job.running);
job.start();