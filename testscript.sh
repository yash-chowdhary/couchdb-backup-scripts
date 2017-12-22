#!/bin/sh

cat $1 | couchrestore --url http://localhost:5984/ --db $2
