var CronJob = require('cron').CronJob;
var cmd = require('node-cmd');

// // customJob will run everyday from 7 AM to 7PM with 1 hour intervals 
// var customJob = new CronJob('0 7-19 * * *', function(){
//     console.log("running customJob now...");
//     cmd.get('run.sh', function(err,data,stderr){
//         console.log(data);
//     });
// },
// function(){
//     console.log("job completed");
// },true,'Asia/Hong_Kong');

// // weeklyJob will run once a week at 0000 hrs on Sunday
// var weeklyJob = new CronJob('0 0 * * 0',, function(){
//     console.log("running weeklyJob now...");
//     cmd.get('run.sh', function(err,data,stderr){
//         console.log(data);
//     });
// },
// function(){
//     console.log("job completed");
// },true,'Asia/Hong_Kong');

var job = new CronJob('*/6 * * * *',function(){
    console.log("running now...");
    cmd.get('run.sh', function(err,data,stderr){
        console.log(data);
    });
},
function(){
    console.log("job completed");
},true,'Asia/Hong_Kong');

console.log('status: '+job.running);
job.start();