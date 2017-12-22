#!/bin/sh

powershell -Command "(gc $1) -replace '\"_attachments\"', '\"$attachments\"' | Out-File -encoding ASCII $1"