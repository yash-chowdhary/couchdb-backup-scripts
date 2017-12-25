#!/bin/sh

node test.js $1 $2 $3

node extract_db.js $1 $2 $3 $4 $5 $6

node replace.js $1 $2 $3 $4 $5 $6

node restore.js $1 $2 $3 $4 $5 $6

node request_helper.js $1 $2 $3 $4 $5 $6