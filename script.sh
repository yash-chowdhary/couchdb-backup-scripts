#!/bin/sh

couchbackup --url https://hereesightertyreatiumbor:e557bfc9bf02bd35bee9bc613fba15ef432d43a6@vaultdragon.cloudant.com/  --db database_backup_test > $1
	
powershell -Command "(gc $1) -replace '_attachments', '$attachments' | Out-File -encoding ASCII $1"

cat $1 | couchrestore --url http://localhost:5984/ --db test_db_3

node request.js $1
