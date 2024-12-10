#!/bin/bash

source /etc/environment

read -p "Blue 서버를 실행할 포트를 입력해주세요." BLUE_PORT
read -p "Green 서버를 실행할 포트를 입력해주세요." GREEN_PORT

BLUE_PID=$(lsof -t -i :$BLUE_PORT)
GREEN_PID=$(lsof -t -i :$GREEN_PORT)

if [ -n "$BLUE_PID" ]; then
	echo "실행중인 Blue 서버를 종료합니다."
	kill -9 $BLUE_PID
	if [ $? -eq 0 ]; then
    		echo "Blue 서버 종료 완료."
  	else
    		echo "프로세스 종료 실패."
	exit 1
  	fi
fi

sleep 3

if [ -n "$GREEN_PID"]; then
    echo "실행중인 Green 서버를 종료합니다."
    kill -9 $GREEN_PID
    if [ $? -eq 0 ]; then
    		echo "Green 서버 종료 완료."
  	else
    		echo "프로세스 종료 실패."
	exit 1
  	fi
fi

sleep 3

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
PORT=$BLUE_PORT
DB_HOST=$DATABASE
CORS_URL=http://$SERVER
EOF

echo "백그라운드에서 Blue 서버를 시작합니다."

npm start &

MAX_WAIT=30
WAIT_INTERVAL=1
TOTAL_WAIT=0

while ! nc -z localhost $BLUE_PORT; do
	sleep $WAIT_INTERVAL
	TOTAL_WAIT=$((TOTAL_WAIT + WAIT_INTERVAL))

	if [ $TOTAL_WAIT -ge $MAX_WAIT ]; then
		echo "Blue 서버 실행 실패..(Time Out)"
		exit 1
	fi
done

START_PID=$(lsof -t -i :$BLUE_PORT)

if [ -n "$START_PID" ]; then
	echo "Blue 서버가 $BLUE_PORT 포트에서 실행되었습니다."
	exit 0
else
	echo "Blue 서버를 실행할 수 없습니다."
	exit 1
fi

MAX_WAIT=30
WAIT_INTERVAL=1
TOTAL_WAIT=0

sed -i "s/^PORT=.*/PORT=$GREEN_PORT/" .env

echo "백그라운드에서 Green 서버를 시작합니다."

while ! nc -z localhost $GREEN_PORT; do
	sleep $WAIT_INTERVAL
	TOTAL_WAIT=$((TOTAL_WAIT + WAIT_INTERVAL))

	if [ $TOTAL_WAIT -ge $MAX_WAIT ]; then
		echo "Green 서버 실행 실패..(Time Out)"
		exit 1
	fi
done

START_PID=$(lsof -t -i :$GREEN_PORT)

if [ -n "$START_PID" ]; then
	echo "Green 서버가 $GREEN_PORT 포트에서 실행되었습니다."
	exit 0
else
	echo "Green 서버를 실행할 수 없습니다."
	exit 1
fi
