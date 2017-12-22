#!/bin/sh

node extract_db.js

node replace.js

node restore.js

node request_helper.js