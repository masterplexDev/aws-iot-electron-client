#!/bin/bash

# 🍎 macOS DMG 전용 빌드 스크립트
# GitHub Release 배포용

set -e

echo "🍎 macOS DMG 빌드 시작..."

# 1. 의존성 설치
echo "📦 의존성 설치 중..."
npm install

# 2. 빌드
echo "🔧 애플리케이션 빌드 중..."
npm run build

# 3. macOS DMG만 빌드
echo "📱 macOS DMG 빌드 중..."
npx electron-builder --mac --publish=never

echo ""
echo "✅ DMG 빌드 완료!"
echo ""
echo "📦 생성된 DMG 파일들:"
ls -la release/*.dmg
echo ""
echo "🚀 GitHub Release에 업로드할 DMG 파일들:"
echo "- AWS IoT Core 테스트 클라이언트-1.0.0-arm64.dmg (M1/M2 Mac)"
echo "- AWS IoT Core 테스트 클라이언트-1.0.0-x64.dmg (Intel Mac)"
echo ""
echo "💡 사용자 안내:"
echo "- 첫 실행 시 '손상되었습니다' 메시지가 나오면 우클릭 → '열기' 선택" 