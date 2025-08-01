#!/bin/bash

# macOS 빌드된 앱 완전 수정 및 실행 스크립트
# trace trap 문제를 근본적으로 해결

echo "🔧 macOS 빌드된 앱 완전 수정 중..."

APP_PATH="release/mac-arm64/AWS IoT Core 테스트 클라이언트.app"
BINARY_PATH="$APP_PATH/Contents/MacOS/AWS IoT Core 테스트 클라이언트"

if [ ! -f "$BINARY_PATH" ]; then
    echo "❌ 빌드된 앱이 없습니다: $BINARY_PATH"
    echo "먼저 빌드를 실행하세요: npm run dist:mac"
    exit 1
fi

echo "✅ 앱 발견: $(ls -la "$BINARY_PATH" | awk '{print $5 " bytes"}')"

echo "🛠️  1단계: 모든 보안 속성 제거..."
# 모든 extended attributes 제거
sudo xattr -cr "$APP_PATH" 2>/dev/null || true

echo "🛠️  2단계: 실행 권한 설정..."
# 실행 권한 설정
sudo chmod -R 755 "$APP_PATH"
sudo chmod +x "$BINARY_PATH"

echo "🛠️  3단계: AWS CRT 모듈 수정..."
# AWS CRT 네이티브 모듈 처리
AWS_CRT_DIR="$APP_PATH/Contents/Resources/app.asar.unpacked/node_modules/aws-crt"
if [ -d "$AWS_CRT_DIR" ]; then
    echo "   🎯 AWS CRT 모듈 발견, 권한 설정 중..."
    sudo find "$AWS_CRT_DIR" -name "*.node" -exec chmod +x {} \; 2>/dev/null || true
    sudo find "$AWS_CRT_DIR" -name "*.dylib" -exec chmod +x {} \; 2>/dev/null || true
fi

echo "🛠️  4단계: Electron Framework 수정..."
# Electron Framework 권한 설정
FRAMEWORKS_DIR="$APP_PATH/Contents/Frameworks"
if [ -d "$FRAMEWORKS_DIR" ]; then
    sudo find "$FRAMEWORKS_DIR" -name "Electron*" -type f -exec chmod +x {} \; 2>/dev/null || true
fi

echo "🛠️  5단계: 시스템 정책 우회..."
# Gatekeeper 등록
sudo spctl --add "$APP_PATH" 2>/dev/null || true

echo "🛠️  6단계: 실행 테스트..."

# 방법 1: open 명령어로 실행
echo "   🚀 방법 1: Finder로 실행..."
open "$APP_PATH" &
sleep 3

if pgrep -f "AWS IoT Core" > /dev/null; then
    echo "   ✅ 성공! 앱이 Finder로 실행됨"
    echo ""
    echo "🎉 빌드된 macOS 앱이 정상 실행되었습니다!"
    echo "📱 앱 프로세스:"
    ps aux | grep -i "AWS IoT Core" | grep -v grep
    exit 0
fi

echo "   ❌ Finder 실행 실패, 다른 방법 시도..."

# 방법 2: 터미널 직접 실행
echo "   🚀 방법 2: 터미널 직접 실행..."
"$BINARY_PATH" &
sleep 3

if pgrep -f "AWS IoT Core" > /dev/null; then
    echo "   ✅ 성공! 앱이 터미널에서 실행됨"
    echo ""
    echo "🎉 빌드된 macOS 앱이 정상 실행되었습니다!"
    echo "📱 앱 프로세스:"
    ps aux | grep -i "AWS IoT Core" | grep -v grep
    exit 0
fi

echo "   ❌ 터미널 실행 실패, 환경변수 방법 시도..."

# 방법 3: 환경변수 포함 실행
echo "   🚀 방법 3: 환경변수 포함 실행..."
DYLD_FORCE_LOAD=1 DYLD_IGNORE_WEAK_SYMBOLS=1 "$BINARY_PATH" &
sleep 3

if pgrep -f "AWS IoT Core" > /dev/null; then
    echo "   ✅ 성공! 앱이 환경변수와 함께 실행됨"
    echo ""
    echo "🎉 빌드된 macOS 앱이 정상 실행되었습니다!"
    echo "📱 앱 프로세스:"
    ps aux | grep -i "AWS IoT Core" | grep -v grep
    exit 0
fi

echo "❌ 모든 실행 방법 실패"
echo ""
echo "🔍 디버그 정보:"
echo "   - 앱 경로: $APP_PATH"
echo "   - 바이너리: $BINARY_PATH"
echo "   - 권한: $(ls -la "$BINARY_PATH" | awk '{print $1}')"
echo ""
echo "🛠️  수동 해결 방법:"
echo "1. 시스템 환경설정 > 보안 및 개인 정보 보호 > 일반"
echo "2. '확인되지 않은 개발자의 앱 허용' 선택"
echo "3. 앱을 우클릭 > '열기' 선택"
echo ""
echo "또는 개발 모드 사용: npm run dev"

exit 1