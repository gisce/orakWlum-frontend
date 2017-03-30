#!/usr/bin/env bash
echo "Replaced Host Name with [$1]"
server_name="$1"
sed -i 's/$HOST_NAME/'$server_name'/g' /etc/nginx/sites-enabled/*
service nginx start
