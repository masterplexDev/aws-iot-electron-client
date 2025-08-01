#!/bin/bash

# macOS 보안 정책 우회 스크립트
# AMFI, Hardened Runtime, SIP 문제를 해결하여 Electron 앱 실행 가능하게 만들기

echo "🛡️  macOS 보안 정책 우회 중..."

APP_PATH="release/mac-arm64/AWS IoT Core 테스트 클라이언트.app"
BINARY_PATH="$APP_PATH/Contents/MacOS/AWS IoT Core 테스트 클라이언트"

if [ ! -d "$APP_PATH" ]; then
    echo "❌ 앱이 없습니다. 먼저 빌드해주세요: npm run dist:mac"
    exit 1
fi

echo "🔍 현재 앱 상태 분석..."

# 1. 현재 서명 상태 확인
echo "1️⃣  현재 서명 상태:"
codesign -dv --verbose=4 "$APP_PATH" 2>&1 | head -10

# 2. 모든 quarantine 속성 제거
echo ""
echo "2️⃣  Quarantine 속성 완전 제거..."
sudo xattr -cr "$APP_PATH"
sudo xattr -cr "$APP_PATH/Contents/Frameworks/"*
sudo xattr -cr "$APP_PATH/Contents/Resources/app.asar.unpacked/"* 2>/dev/null || true

# 3. 모든 바이너리에 실행 권한 부여
echo "3️⃣  실행 권한 설정..."
sudo chmod +x "$BINARY_PATH"
sudo chmod +x "$APP_PATH/Contents/Frameworks/"*/Versions/*/*/Electron* 2>/dev/null || true
sudo chmod +x "$APP_PATH/Contents/Resources/app.asar.unpacked/node_modules/aws-crt/dist/bin/"*/*.node 2>/dev/null || true

# 4. Ad-hoc 서명 적용 (최소한의 서명)
echo "4️⃣  Ad-hoc 서명 적용..."
sudo codesign --force --deep --sign - --preserve-metadata=entitlements,requirements,flags,runtime "$APP_PATH" 2>/dev/null || true

# 5. 강제 신뢰 설정
echo "5️⃣  강제 신뢰 설정..."
sudo spctl --add "$APP_PATH" 2>/dev/null || true
sudo spctl --enable --label "$APP_PATH" 2>/dev/null || true

# 6. 실행 권한 재설정
echo "6️⃣  최종 권한 설정..."
sudo chmod -R 755 "$APP_PATH"
sudo chmod +x "$BINARY_PATH"

echo ""
echo "✅ 보안 우회 완료!"
echo "🚀 이제 앱을 실행해보세요:"
echo "   open \"$APP_PATH\""
echo ""
echo "🔧 직접 실행:"
echo "   \"$BINARY_PATH\""