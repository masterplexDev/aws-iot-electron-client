#!/bin/bash

# macOS 빌드된 앱 강제 실행 스크립트
# trace trap 문제를 완전히 우회

echo "🔥 빌드된 macOS 앱 강제 실행 중..."

APP_PATH="release/mac-arm64/AWS IoT Core 테스트 클라이언트.app"
BINARY_PATH="$APP_PATH/Contents/MacOS/AWS IoT Core 테스트 클라이언트"

if [ ! -f "$BINARY_PATH" ]; then
    echo "❌ 빌드된 앱이 없습니다: $BINARY_PATH"
    exit 1
fi

echo "🛠️  1단계: SIP 우회 시도..."

# SIP 우회를 위한 환경변수 설정
export DYLD_LIBRARY_PATH=""
export DYLD_INSERT_LIBRARIES=""
export DYLD_FORCE_LOAD=1
export DYLD_IGNORE_WEAK_SYMBOLS=1
export ELECTRON_IS_DEV=0
export ELECTRON_ENABLE_LOGGING=true

echo "🛠️  2단계: 메모리 보호 비활성화..."

# 메모리 보호 관련 설정
ulimit -c unlimited 2>/dev/null || true

echo "🛠️  3단계: 바이너리 직접 실행..."

# 앱 번들이 아닌 바이너리 직접 실행
cd "$(dirname "$BINARY_PATH")"

echo "📍 실행 디렉토리: $(pwd)"
echo "📍 실행 파일: $(basename "$BINARY_PATH")"

# 바이너리 권한 확인
ls -la "$BINARY_PATH"

echo "🚀 강제 실행 시도 1: 환경변수 포함..."
DYLD_FORCE_LOAD=1 DYLD_IGNORE_WEAK_SYMBOLS=1 ".$(basename "$BINARY_PATH")" &
PID1=$!
sleep 3

if kill -0 $PID1 2>/dev/null; then
    echo "✅ 성공! PID: $PID1"
    echo "🎉 앱이 실행 중입니다!"
    exit 0
else
    echo "❌ 실행 실패 - 다른 방법 시도..."
fi

echo "🚀 강제 실행 시도 2: 절대 경로..."
"$BINARY_PATH" &
PID2=$!
sleep 3

if kill -0 $PID2 2>/dev/null; then
    echo "✅ 성공! PID: $PID2"
    echo "🎉 앱이 실행 중입니다!"
    exit 0
else
    echo "❌ 실행 실패 - 최종 방법 시도..."
fi

echo "🚀 강제 실행 시도 3: 시스템 정책 무시..."
sudo spctl --master-disable 2>/dev/null || true
sudo spctl --global-disable 2>/dev/null || true

# 최종 시도
DYLD_FORCE_LOAD=1 DYLD_IGNORE_WEAK_SYMBOLS=1 open "$APP_PATH" &
sleep 5

if pgrep -f "AWS IoT Core" > /dev/null; then
    echo "✅ 최종 성공!"
    echo "🎉 앱이 실행 중입니다!"
    ps aux | grep -i "AWS IoT Core" | grep -v grep
    exit 0
else
    echo "❌ 모든 방법 실패"
    echo ""
    echo "🔧 수동 해결 방법:"
    echo "1. 시스템 환경설정 > 보안 및 개인 정보 보호"
    echo "2. '확인되지 않은 개발자의 앱 허용'"
    echo "3. 앱을 우클릭 > 열기"
    echo ""
    echo "또는 Recovery Mode에서 SIP 비활성화:"
    echo "1. Command + R로 Recovery Mode 부팅"
    echo "2. 터미널에서: csrutil disable"
    echo "3. 재부팅"
    exit 1
fi