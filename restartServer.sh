#!/bin/bash

source /etc/environment

PORT=3000

PID=$(lsof -t -i :$PORT)

if [ -n "$PID" ]; then
	echo "실행되고 있는 서버를 종료합니다."
	kill -9 $PID
	if [ $? -eq 0 ]; then
    		echo "프로세스 $PID 종료 완료."
  	else
    		echo "프로세스 종료 실패."
	exit 1
  	fi
fi

sleep 1

echo "서버를 시작합니다."
echo "시작하기 위해 서버의 정보를 입력해주세요."

read -p "서버의 ip를 입력해주세요: " SERVER
read -p "데이터 베이스 서버의 ip를 입력해주세요: " DATABASE

echo "서버의 정보를 초기화하고 있습니다."

ENVFILE=".env"
if [ -f "$ENVFILE" ]; then
	: > "$ENVFILE"
	echo "서버의 정보를 초기화했습니다."
else
	echo "서버 정보 파일이 존재하지 않습니다. .env 파일을 생성해주세요."
	exit 1
fi

cat >> .env << EOF
DB_ID=$DB_USER
DB_PASS=$DB_PASS
DATABASE=$DB_NAME
DB_PORT=$DB_PORT
PROJECT_ROOT=<dynamic>
PORT=$BE_PORT
DB_HOST=$DATABASE
CORS_URL=http://$SERVER
EOF

echo "백그라운드에서 서버를 시작합니다."

npm start &

sleep 3

START_PID=$(lsof -t -i :$PORT)

if [ -n "$START_PID" ]; then
	echo "서버가 실행되었습니다."
	exit 0
else
	echo "서버를 실행할 수 없습니다."
	exit 1
fi

