var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-load'));
const fs = require('fs');
const couchbackup = require('@cloudant/couchbackup');

var remote_db = new PouchDB('http://localhost:5984/test_db_3');

remote_db.info().then(function (info) {
    console.log(info);
  })

let filename = 'test_backup.txt';

// couchbackup.restore(
// fs.createReadStream(filename),
// 'http://localhost:5984/test_db',
// {parallelism: 5},
// function(err, data) {
//     if (err) {
//     console.error("Failed! " + err);
//     } else {
//     console.error("Success! " + data);
//     }
// });
// remote_db.load(filename).then(function () {
//   // done loading!
//   console.log("Done")
// }).catch(function (err) {
//   // HTTP error or something like that
//   console.log("Nope")
// });  
// //couchbackup.restore('test_backup.txt');