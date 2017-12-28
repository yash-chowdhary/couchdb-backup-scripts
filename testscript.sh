#!/bin/sh

cat $1 | couchrestore --url $2 --db $3
