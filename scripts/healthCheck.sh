#!/bin/bash

echo "> Health check 시작"
echo "> curl -s -o /dev/null -w '%{http_code}' http://localhost:5173"

for RETRY_COUNT in {1..15}
do
  # RESPONSE CODE는 HTTP 응답 코드만 가져옵니다.
  RESPONSE_CODE=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:5173)

  if [ "$RESPONSE_CODE" -eq 200 ]
  then
      echo "> Health check 성공: HTTP 200 응답 확인됨"
      break
  else
      echo "> Health check의 응답 코드가 200이 아닙니다."
      echo "> 응답 코드: ${RESPONSE_CODE}"
  fi

  if [ $RETRY_COUNT -eq 15 ]
  then
    echo "> Health check 실패."
    exit 1
  fi

  echo "> Health check 연결 실패. 재시도..."
  sleep 10
done

exit 0
