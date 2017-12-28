var CronJob = require('cron').CronJob;
var cmd = require('node-cmd');

// var main_param_username = process.argv[2].toString();
// var main_param_password = process.argv[3].toString();
// var main_param_dbname = process.argv[4].toString();
// var start = process.argv[5];
// var end = process.argv[6];
// var type = process.argv[7].toString();
// var portNumber = process.argv[8].toString();

var param_scriptNumber = process.argv[2].toString();

// // customJob will run everyday from 7 AM to 7PM at 1 hour intervals 
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

var job = new CronJob('*/3 * * * *',function(){
    console.log("running now...");
    // cmd.get('run.sh ' + main_param_username + ' ' + main_param_password + ' ' + main_param_dbname+' '+ start + ' ' + end + ' ' + type + ' ' + portNumber, function(err,data,stderr){
    //     console.log('completed.');
    // });
    cmd.get('script_'+param_scriptNumber+'.sh',function(){
        console.log('completed');
    })
},
function(){
    console.log("job completed");
},true,'Asia/Hong_Kong');

console.log('status: '+job.running);
job.start();