#!/bin/bash

# AWS IoT Core 테스트 클라이언트 macOS 실행 문제 해결 스크립트

echo "🔧 AWS IoT Core 테스트 클라이언트 macOS 실행 문제 해결 중..."

# 앱 경로
APP_PATH="/Applications/AWS IoT Core 테스트 클라이언트.app"

if [ ! -d "$APP_PATH" ]; then
    echo "❌ 앱이 설치되지 않았습니다: $APP_PATH"
    echo "먼저 DMG 파일을 사용하여 앱을 설치해주세요."
    exit 1
fi

echo "📱 앱 발견: $APP_PATH"

# 1. Quarantine 속성 제거 (macOS Gatekeeper 우회)
echo "🔐 Quarantine 속성 제거 중..."
sudo xattr -r -d com.apple.quarantine "$APP_PATH" 2>/dev/null || true

# 2. 코드 서명 정보 확인
echo "📋 코드 서명 정보:"
codesign -dv "$APP_PATH" 2>&1 || echo "코드 서명 없음"

# 3. 실행 권한 확인
echo "🔑 실행 권한 설정 중..."
chmod +x "$APP_PATH/Contents/MacOS/AWS IoT Core 테스트 클라이언트"

# 4. 앱 실행 시도
echo "🚀 앱 실행 중..."
open "$APP_PATH"

echo "✅ 완료! 앱이 실행되었습니다."
echo ""
echo "💡 만약 여전히 문제가 발생한다면:"
echo "1. 시스템 환경설정 > 보안 및 개인정보 보호로 이동"
echo "2. '확인되지 않은 개발자' 경고가 나타나면 '실행' 클릭"
echo "3. 또는 터미널에서 다음 명령 실행:"
echo "   sudo spctl --master-disable"
echo "   (주의: 이 명령은 Gatekeeper를 완전히 비활성화합니다)"