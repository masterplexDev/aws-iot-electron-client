#!/bin/bash

# AWS IoT Core 테스트 클라이언트 - 다른 Mac에서 실행하기

echo "🔧 AWS IoT Core 테스트 클라이언트 수정 중..."

# 앱 경로
APP_PATH="/Applications/AWS IoT Core 테스트 클라이언트.app"

if [ ! -d "$APP_PATH" ]; then
    echo "❌ 앱이 설치되지 않았습니다. 먼저 DMG를 설치해주세요."
    exit 1
fi

echo "📝 격리 속성 제거 중..."
sudo xattr -rd com.apple.quarantine "$APP_PATH"

echo "🔐 Ad-hoc 서명 적용 중..."
sudo codesign --force --deep --sign - "$APP_PATH"

echo "✅ 수정 완료! 이제 앱을 실행할 수 있습니다."
echo "🚀 Launchpad에서 'AWS IoT Core 테스트 클라이언트'를 실행해보세요."