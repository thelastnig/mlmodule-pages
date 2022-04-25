#!/bin/sh

case "$(uname -s)" in
   Darwin)
     echo 'Mac OS X'
     IP=`ifconfig  | grep inet | grep -v inet6 | tail -n1 | awk '{print $2}'`
     ;;

   Linux)
     echo 'Linux'
     IP=$(hostname -I)
     ;;
esac
LOCAL_IP=${IP%% *}
echo $LOCAL_IP

AI_FRONTEND_EXT_PORT=8080
AI_FRONTEND_INT_PORT=80

# docker stop
CONTAINER_ID=$(docker ps -a | grep -v Exit | grep 0.0.0.0:$AI_FRONTEND_EXT_PORT | awk '{print $1}')
if [[ -n $CONTAINER_ID ]] ; then
docker stop $CONTAINER_ID
fi


# AI FRONTEND
docker run -d \
-p $AI_FRONTEND_EXT_PORT:$AI_FRONTEND_INT_PORT ai_frontend
