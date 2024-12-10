#!/bin/bash

source /etc/environment

read -p "Blue 서버를 실행할 포트를 입력해주세요." BLUE_PORT
read -p "Green 서버를 실행할 포트를 입력해주세요." GREEN_PORT

kill_server() {
    local port=$1
    local name=$2

    local pid=$(lsof -t -i :$port)
    if [ -n "$pid" ]; then
        echo "실행 중인 $name 서버(PID: $pid)를 종료합니다."
        kill -9 $pid

        # 종료 대기
        local wait_time=0
        local max_wait=30

        while kill -0 $pid 2>/dev/null; do
            sleep 1
            wait_time=$((wait_time + 1))
            if [ $wait_time -ge $max_wait ]; then
                echo "$name 서버 종료에 실패했습니다. (시간 초과)"
                exit 1
            fi
        done

        echo "$name 서버 종료 완료."
    else
        echo "$name 서버는 실행 중이 아닙니다."
    fi
}

start_server() {
    local port=$1
    local name=$2
    local directory=$3

    cd /home/ubuntu/$directory

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
    PORT=$port
    DB_HOST=$DATABASE
    CORS_URL=http://$SERVER
EOF

    echo "백그라운드에서 $name 서버를 시작합니다."
    nohup npm start &

    local max_wait=30
    local wait_interval=1
    local total_wait=0

    while ! nc -z localhost $port; do
        sleep $wait_interval
        total_wait=$((total_wait + wait_interval))

        if [ $total_wait -ge $max_wait ]; then
            echo "$name 서버 실행 실패..(Time Out)"
            exit 1
        fi
    done

    local start_pid=$(lsof -t -i :$port)
    if [ -n "$start_pid" ]; then
        echo "$name 서버가 $port 포트에서 실행되었습니다."
    else
        echo "$name 서버를 실행할 수 없습니다."
        exit 1
    fi
}

BLUE_PID=$(lsof -t -i :$BLUE_PORT)
GREEN_PID=$(lsof -t -i :$GREEN_PORT)

kill_server $BLUE_PORT "Blue"
kill_server $GREEN_PORT "Green"

echo "서버를 시작합니다."
echo "시작하기 위해 서버의 정보를 입력해주세요."

read -p "서버의 ip를 입력해주세요: " SERVER
read -p "데이터 베이스 서버의 ip를 입력해주세요: " DATABASE

echo "서버의 정보를 초기화하고 있습니다."

start_server $BLUE_PORT "Blue" "backend-main"

start_server $GREEN_PORT "Green" "backend-feature"
