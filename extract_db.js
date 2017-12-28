var http = require('http');
var https = require('https');
var cmd = require('node-cmd');
var fs = require('fs');
var rp = require('request-promise');
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-load'));

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'testvdragon@gmail.com',
        pass: 'testvdragon!'
    }
});

var main_param_username = process.argv[2].toString();
var main_param_password = process.argv[3].toString();
var main_param_dbname = process.argv[4].toString();
var start = process.argv[5];
// var end = process.argv[6];
var type = process.argv[6].toString();
var portNumber = process.argv[7].toString();

var body ='';
var param_dbname ='',
param_username='',
param_password='';
var request = rp("https://"+main_param_username+":"+main_param_password+"@vaultdragon.cloudant.com/"+main_param_dbname+"/_all_docs?include_docs=true")
.then(
    function(chunk){
        body+=chunk;
        var object = JSON.parse(body);
        if(type === 'D' && object.rows[start].doc.hasOwnProperty('dragonfly')){
            param_dbname = object.rows[start].doc.dragonfly.cloudantDatabase.toString();
            param_password = object.rows[start].doc.dragonfly.cloudantPassword.toString();
            param_username = object.rows[start].doc.dragonfly.cloudantUsername.toString();
            var dragonflyBackupFileName = 'encrypted_'+param_dbname+'.txt';
            var dragonfly_cmdCommand_backup = 'couchbackup --url https://'+ param_username + ':' + param_password
            + '@vaultdragon.cloudant.com/ --db ' + param_dbname + '| openssl aes-128-cbc -pass pass:vaultdragon' + ' > ' + dragonflyBackupFileName;
            console.log(dragonfly_cmdCommand_backup);
            var promise = new Promise (function(resolve,reject){
                cmd.get(dragonfly_cmdCommand_backup,function(err,data,stderr){                    // complete backup
                    if(!err){
                        console.log('backup complete');
                        resolve();
                    }    
                    else{
                        console.log('backup failed');
                    }
                });
            }).then(function(resolve){                                    // complete decrypt + replace
                var backupFileName_enc = 'encrypted_'+param_dbname+'.txt';
                var backupFileName_dec = 'decrypted_'+param_dbname+'.txt';
                var cmdCommand_decrypt = 'openssl aes-128-cbc -d -in '+backupFileName_enc +' -pass pass:vaultdragon -out '+backupFileName_dec;
                console.log(cmdCommand_decrypt);
                cmd.get(cmdCommand_decrypt,function(err,data,stderr){
                    if(!err){
                        console.log('decryption complete');
                        cmd.run('replacescript.sh ' + backupFileName_dec);
                    }
                    else{
                        console.log('this is getting printed');
                    }
                });
            }).then(function(resolve){                                      // complete restore
                var backupFileName = 'decrypted_'+param_dbname+'.txt';
                var cmdCommand_pouch = 'pouchdb-server --port '+portNumber;
                // console.log('printing this');
                cmd.get(cmdCommand_pouch, function(){
                    var dragonflyDbUrl = 'http://localhost:'+portNumber+'/'+ param_dbname;
                    console.log(dragonflyDbUrl);
                    var remote_db_dragonfly = new PouchDB(dragonflyDbUrl);
                    remote_db_dragonfly.info().then(function (info) {
                        console.log('db added');
                    })
                    var url = 'http://localhost:'+portNumber+'/';
                    var cmdCommand_restore = 'testscript.sh '+backupFileName+' '+url+' '+param_dbname;
                    console.log('still...')
                    //call couchrestore
                    cmd.get(cmdCommand_restore,function(err,data,stderr){
                        // console.log('restore complete.');
                        if(!err){
                            console.log('restore complete');
                            // resolve();
                            var cmdCommand = 'request_caller.sh '+param_username+' '+param_password+' '+param_dbname+' '+portNumber;
                            cmd.get(cmdCommand,function(err,data,stderr){
                                if(err){
                                    reject();
                                }
                                else{
                                    console.log('uploaded\n');
                                }
                            });
                        }
                        else{
                            reject();
                        }
                    });
                });
            },function(reject){
                var mailOptions = {
                    from: 'testvdragon@gmail.com',
                    to: 'yashchowdhary98@gmail.com',
                    subject: 'Backup failed:' + param_dbname,
                    text: 'Backup of database \''+param_dbname+'\' failed',
                };
                
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                }); 
                console.log('backup failed');
            }).then(
                function(resolve){},
                function(reject){
                    var mailOptions = {
                        from: 'testvdragon@gmail.com',
                        to: 'yashchowdhary98@gmail.com',
                        subject: 'Restore failed:' + param_dbname,
                        text: 'Restore of database \''+param_dbname+'\' failed',
                    };
                    
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    console.log('restore failed');  
                }).then(function(resolve){
                    console.log('all tasks completed');
                },function(reject){
                    var mailOptions = {
                        from: 'testvdragon@gmail.com',
                        to: 'yashchowdhary98@gmail.com',
                        subject: 'Upload failed:' + param_dbname,
                        text: 'Upload of database \''+param_dbname+'\' to AWS S3 failed',
                    };
                    
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    console.log('verification / upload failed');
                });
            }   
            else if(type === 'C' && object.rows[start].doc.hasOwnProperty('cms')){                  // cms databases
                param_dbname = object.rows[start].doc.cms.cloudantDatabase.toString();
                param_password = object.rows[start].doc.cms.cloudantPassword.toString();
                param_username = object.rows[start].doc.cms.cloudantUsername.toString();
                var cmsBackupFileName = 'encrypted_'+param_dbname+'.txt';
                var cms_cmdCommand_backup = 'couchbackup --url https://'+ param_username + ':' + param_password
                + '@vaultdragon.cloudant.com/ --db ' + param_dbname + ' | openssl aes-128-cbc -pass pass:vaultdragon' + ' > ' + cmsBackupFileName;
                console.log(cms_cmdCommand_backup);
                var promise = new Promise (function(resolve,reject){
                    cmd.get(cms_cmdCommand_backup,function(err,data,stderr){                    // complete backup
                        if(!err){
                            console.log('backup complete');
                            resolve();
                        }    
                        else{
                            console.log('backup failed');
                        }
                    });
                }).then(function(resolve){                                                      // complete decrypt + replace
                    var backupFileName_enc = 'encrypted_'+param_dbname+'.txt';
                    var backupFileName_dec = 'decrypted_'+param_dbname+'.txt';
                    var cmdCommand_decrypt = 'openssl aes-128-cbc -d -in '+backupFileName_enc +' -pass pass:vaultdragon -out '+backupFileName_dec;
                    console.log(cmdCommand_decrypt);
                    cmd.get(cmdCommand_decrypt,function(err,data,stderr){
                        if(!err){
                            console.log('decryption complete');
                            cmd.run('replacescript.sh ' + backupFileName_dec);
                        }
                        else{
                            console.log('this is getting printed');
                        }
                    });
                }).then(function(resolve){                                                      // complete restore
                    var backupFileName = 'decrypted_'+param_dbname+'.txt';
                    var cmdCommand_pouch = 'pouchdb-server --port '+portNumber;
                    // console.log('printing this');
                    cmd.get(cmdCommand_pouch, function(){
                        var cmsDbUrl = 'http://localhost:'+portNumber+'/'+ param_dbname;
                        console.log(cmsDbUrl);
                        var remote_db_cms = new PouchDB(cmsDbUrl);
                        remote_db_cms.info().then(function (info) {
                            console.log('db added');
                        })
                        var url = 'http://localhost:'+portNumber+'/';
                        var cmdCommand_restore = 'testscript.sh '+backupFileName+' '+url+' '+param_dbname;
                        console.log('still...')
                        //call couchrestore
                        cmd.get(cmdCommand_restore,function(err,data,stderr){
                            // console.log('restore complete.');
                            if(!err){
                                console.log('restore complete');
                                // resolve();
                                var cmdCommand = 'request_caller.sh '+param_username+' '+param_password+' '+param_dbname+' '+portNumber;
                                cmd.get(cmdCommand,function(err,data,stderr){
                                    if(err){
                                        reject();
                                    }
                                    else{
                                        console.log('uploaded\n');
                                    }
                                });
                            }
                            else{
                                reject();
                            }
                        });
                    });
                },function(reject){
                    var mailOptions = {
                        from: 'testvdragon@gmail.com',
                        to: 'yashchowdhary98@gmail.com',
                        subject: 'Backup failed:' + param_dbname,
                        text: 'Backup of database \''+param_dbname+'\' failed',
                    };
                    
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    }); 
                    console.log('backup failed');
                }).then(
                    function(resolve){},
                    function(reject){
                        var mailOptions = {
                            from: 'testvdragon@gmail.com',
                            to: 'yashchowdhary98@gmail.com',
                            subject: 'Restore failed:' + param_dbname,
                            text: 'Restore of database \''+param_dbname+'\' failed',
                        };
                        
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                        console.log('restore failed');  
                    }).then(function(resolve){
                        console.log('all tasks completed');
                    },function(reject){
                        var mailOptions = {
                            from: 'testvdragon@gmail.com',
                            to: 'yashchowdhary98@gmail.com',
                            subject: 'Upload failed:' + param_dbname,
                            text: 'Upload of database \''+param_dbname+'\' to AWS S3 failed',
                        };
                        
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                        console.log('verification / upload failed');
                    });
                }
                else if(type === 'A'){                  // other databases
                    param_dbname = object.rows[start].doc.cloudantDatabase.toString();
                    param_password = object.rows[start].doc.cloudantPassword.toString();
                    param_username = object.rows[start].doc.cloudantUsername.toString();
                    var backupFileName = 'encrypted_'+param_dbname+'.txt';
                    var cmdCommand_backup = 'couchbackup --url https://'+ param_username + ':' + param_password
                    + '@vaultdragon.cloudant.com/ --db ' + param_dbname + ' | openssl aes-128-cbc -pass pass:vaultdragon' + ' > ' + backupFileName;
                    console.log(cmdCommand_backup);
                    var promise = new Promise (function(resolve,reject){
                        cmd.get(cmdCommand_backup,function(err,data,stderr){                    // complete backup
                            if(!err){
                                console.log('backup complete');
                                resolve();
                            }    
                            else{
                                console.log('backup failed');
                            }
                        });
                    }).then(function(resolve){                                                      // complete decrypt + replace
                        var backupFileName_enc = 'encrypted_'+param_dbname+'.txt';
                        var backupFileName_dec = 'decrypted_'+param_dbname+'.txt';
                        var cmdCommand_decrypt = 'openssl aes-128-cbc -d -in '+backupFileName_enc +' -pass pass:vaultdragon -out '+backupFileName_dec;
                        console.log(cmdCommand_decrypt);
                        cmd.get(cmdCommand_decrypt,function(err,data,stderr){
                            if(!err){
                                console.log('decryption complete');
                                cmd.run('replacescript.sh ' + backupFileName_dec);
                            }
                            else{
                                console.log('this is getting printed');
                            }
                        });
                    }).then(function(resolve){                                                      // complete restore
                        var backupFileName = 'decrypted_'+param_dbname+'.txt';
                        var cmdCommand_pouch = 'pouchdb-server --port '+portNumber;
                        // console.log('printing this');
                        cmd.get(cmdCommand_pouch, function(){
                            var dbUrl = 'http://localhost:'+portNumber+'/'+ param_dbname;
                            console.log(dbUrl);
                            var remote_db = new PouchDB(dbUrl);
                            remote_db.info().then(function (info) {
                                console.log('db added');
                            })
                            var url = 'http://localhost:'+portNumber+'/';
                            var cmdCommand_restore = 'testscript.sh '+backupFileName+' '+url+' '+param_dbname;
                            console.log('still...')
                            //call couchrestore
                            cmd.get(cmdCommand_restore,function(err,data,stderr){
                                // console.log('restore complete.');
                                if(!err){
                                    console.log('restore complete');
                                    // resolve();
                                    var cmdCommand = 'request_caller.sh '+param_username+' '+param_password+' '+param_dbname+' '+portNumber;
                                    cmd.get(cmdCommand,function(err,data,stderr){
                                        if(err){
                                            reject();
                                        }
                                        else{
                                            console.log('uploaded\n');
                                        }
                                    });
                                }
                                else{
                                    reject();
                                }
                            });
                        });
                        
                        
                    },function(reject){
                        var mailOptions = {
                            from: 'testvdragon@gmail.com',
                            to: 'yashchowdhary98@gmail.com',
                            subject: 'Backup failed:' + param_dbname,
                            text: 'Backup of database \''+param_dbname+'\' failed',
                        };
                        
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        }); 
                        console.log('backup failed');
                    }).then(
                        function(resolve){},
                        function(reject){
                            var mailOptions = {
                                from: 'testvdragon@gmail.com',
                                to: 'yashchowdhary98@gmail.com',
                                subject: 'Restore failed:' + param_dbname,
                                text: 'Restore of database \''+param_dbname+'\' failed',
                            };
                            
                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                }
                            });
                            console.log('restore failed');  
                        }).then(function(resolve){
                            console.log('all tasks completed');
                        },function(reject){
                            var mailOptions = {
                                from: 'testvdragon@gmail.com',
                                to: 'yashchowdhary98@gmail.com',
                                subject: 'Upload failed:' + param_dbname,
                                text: 'Upload of database \''+param_dbname+'\' to AWS S3 failed',
                            };
                            
                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                }
                            });
                            console.log('verification / upload failed');
                        });
                    }
            }
        );