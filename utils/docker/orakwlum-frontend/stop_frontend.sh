#!/bin/bash
# Get id from file generated from start script
filename="id_frontend"
if [ -e $filename ]; then
    expected=`cat $filename`
else 
    exit -1
fi
# Stop using id from file
name=`docker stop $expected`
if [ "$name" == $expected ]; then
    echo -e ">\tStopped '$name'"
else
    echo -e ">\tCould not stop '$expected'! Is it running?"
fi
# Delete using id from file
name=`docker rm $expected`
if [ "$name" == $expected ]; then
    echo -e ">\tRemoved '$name'"
else
    echo -e ">\tCould not removed '$expected'! Does it exists?"
fi
# Delete id file
rm $filename
# Show Available Dockers
echo "------------------------------------------------------"
echo "|              Available Dockers (ps -a):            |"
echo "------------------------------------------------------"
docker ps -a

