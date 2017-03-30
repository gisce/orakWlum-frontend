#!/bin/bash
# Set Server Name
if [ "$#" -ne 1 ]; then
    def_serv_name="localhost"
    echo -n "Enter a server name to patch [$def_serv_name]: "
    read server_name
    if [ "$server_name" = "" ]; then
        server_name=$def_serv_name
    fi
else
    server_name="$1"
fi
name="frontend"
container="okw/"$name
ports="-p 8080:80 -p 443:443"
socket_path="/tmp/docker_sockets"
if [ -d $socket_path ]; then
    mkdir -p $socket_path
fi
# Ensure permissions on socket
chmod -R 777 $socket_path
sockets="-v $socket_path:/tmp/"
log_path="/var/log/nginx/frontend_docker"
if [ -d $log_path ]; then
    mkdir -p $log_path
fi
logs="-v $log_path:/var/log/orakwlum"
# Stop and delete last frontend container
./stop_frontend.sh
container_id=`docker run $ports --name $name -d $sockets $logs -i $container /run_frontend.sh $server_name`
if [ "$container_id" != "" ]
then
    echo "$container_id" > id_frontend
    echo "Container $container started! id: $container_id"
else
    if [ -e "id_frontend" ]; then
        rm id_frontend
    fi
    echo "Error spawning docker!"
fi
