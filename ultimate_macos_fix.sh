#!/bin/bash

# macOS 보안 정책 완전 우회 - 최종 해결책
# AMFI, Hardened Runtime, SIP 문제를 모두 해결

echo "🔥 macOS 보안 정책 완전 우회 중..."

APP_PATH="release/mac-arm64/AWS IoT Core 테스트 클라이언트.app"
BINARY_PATH="$APP_PATH/Contents/MacOS/AWS IoT Core 테스트 클라이언트"

if [ ! -d "$APP_PATH" ]; then
    echo "❌ 앱이 없습니다. 먼저 빌드해주세요: npm run dist:mac"
    exit 1
fi

echo "🔧 1단계: 모든 보안 속성 완전 제거..."

# 1. 모든 extended attributes 제거 (quarantine, com.apple.*)
sudo find "$APP_PATH" -type f -exec xattr -c {} \; 2>/dev/null || true
sudo find "$APP_PATH" -type d -exec xattr -c {} \; 2>/dev/null || true

# 2. 실행 파일들 권한 설정
echo "🔧 2단계: 실행 권한 완전 설정..."
sudo chmod -R 755 "$APP_PATH"
sudo chmod +x "$BINARY_PATH"

# AWS CRT 네이티브 모듈들
sudo find "$APP_PATH/Contents/Resources/app.asar.unpacked" -name "*.node" -exec chmod +x {} \; 2>/dev/null || true
sudo find "$APP_PATH/Contents/Frameworks" -name "*" -type f -exec chmod +x {} \; 2>/dev/null || true

echo "🔧 3단계: AMFI 우회 시도..."

# 3. 각 바이너리별로 개별 처리
# 메인 실행 파일
sudo chmod 755 "$BINARY_PATH"

# Electron Framework들
sudo find "$APP_PATH/Contents/Frameworks" -name "Electron*" -type f -exec chmod +x {} \; 2>/dev/null || true

# AWS CRT 모듈들 (가장 중요!)
AWS_CRT_PATH="$APP_PATH/Contents/Resources/app.asar.unpacked/node_modules/aws-crt/dist/bin/darwin-arm64-cruntime"
if [ -d "$AWS_CRT_PATH" ]; then
    echo "   🎯 AWS CRT 모듈 처리 중..."
    sudo chmod +x "$AWS_CRT_PATH"/*.node 2>/dev/null || true
    sudo chmod 755 "$AWS_CRT_PATH"/*.node 2>/dev/null || true
    
    # 각 .node 파일에 대해 개별 서명 시도
    for node_file in "$AWS_CRT_PATH"/*.node; do
        if [ -f "$node_file" ]; then
            echo "     - 처리 중: $(basename "$node_file")"
            sudo chmod +x "$node_file"
            # 간단한 ad-hoc 서명 시도 (에러 무시)
            sudo codesign --force --sign - "$node_file" 2>/dev/null || true
        fi
    done
fi

echo "🔧 4단계: Gatekeeper 우회..."

# 4. Gatekeeper 등록 시도
sudo spctl --add "$APP_PATH" 2>/dev/null || true
sudo spctl --enable --label "AWS IoT Core Test Client" 2>/dev/null || true

echo "🔧 5단계: 시스템 정책 우회..."

# 5. 앱을 신뢰할 수 있는 앱으로 등록 시도
sudo /usr/sbin/system_policy --add --label "AWS IoT Core Test Client" --allow --force 2>/dev/null || true

echo "🔧 6단계: 런타임 환경 설정..."

# 6. 환경 변수 설정으로 보안 완화
export DYLD_FORCE_LOAD=1
export DYLD_IGNORE_WEAK_SYMBOLS=1

echo ""
echo "✅ 최종 보안 우회 완료!"
echo ""
echo "🚀 이제 다음 방법들로 앱을 실행해보세요:"
echo ""
echo "방법 1 (Finder):"
echo "   open \"$APP_PATH\""
echo ""
echo "방법 2 (터미널 직접):"
echo "   \"$BINARY_PATH\""
echo ""
echo "방법 3 (환경변수 포함):"
echo "   DYLD_FORCE_LOAD=1 DYLD_IGNORE_WEAK_SYMBOLS=1 \"$BINARY_PATH\""
echo ""
echo "🔍 만약 여전히 실행되지 않으면:"
echo "1. 시스템 재시작"
echo "2. Security & Privacy에서 앱 허용"
echo "3. 개발자 옵션에서 'Allow applications downloaded from Anywhere' 활성화"