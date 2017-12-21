var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-load'));
const fs = require('fs');
var http = require('http');
var https = require('https');
const couchbackup = require('@cloudant/couchbackup');

var body='';
var request = https.get("https://manareasedinguallyarthei:546b7799281fc1eb8836d7f509d7cbaac24c375c@vaultdragon.cloudant.com/vaultdragon/_all_docs?include_docs=true",
function(res){
	res.on('data', function(chunk){
		body+=chunk;
	});
	res.on('end',function(){
		body = body.trim();
		var object = JSON.parse(body);
		for(let i=0;i<35;i++){
			if(object.rows[i].id.substring(0,1) != '_'){        //filters out ones that don't have nested databases
				
				if(object.rows[i].doc.hasOwnProperty('cms')){   //filters out the ones that have cms & dragonfly databases
					var cmsDbUrl = 'http://localhost:5984/' + object.rows[i].doc.cms.cloudantDatabase.toString();
					var dragonflyDbUrl = 'http://localhost:5984/' + object.rows[i].doc.dragonfly.cloudantDatabase.toString();
					console.log(cmsDbUrl);
					console.log(dragonflyDbUrl);
					
					var remote_db_cms = new PouchDB(cmsDbUrl);
					var remote_db_dragonfly = new PouchDB(dragonflyDbUrl);

					remote_db_cms.info().then(function (info) {
						console.log('db added');
					})
					remote_db_dragonfly.info().then(function (info) {
						console.log('db added');
					})
				}   else{
						
					var remote_db = new PouchDB('http://localhost:5984/'+object.rows[i].doc.cloudantDatabase);
					remote_db.info().then(function (info) {
						console.log('db added');
					})
				}
			}
		}
	});
})