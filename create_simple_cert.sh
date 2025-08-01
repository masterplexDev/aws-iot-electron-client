#!/bin/bash

# 간단한 개발자 인증서 생성 (키체인 비밀번호 없이)

echo "🔐 간단한 개발자 인증서 생성 중..."

# 키체인 언락 (현재 세션에서)
security unlock-keychain ~/Library/Keychains/login.keychain-db || true

# Certificate Assistant를 통한 자동 인증서 생성
echo "📜 코드 서명 인증서 생성 중..."

# 직접 키체인에 self-signed 인증서 생성
security create-keypair -a ECDSA -s 256 -S 2 -l "AWS IoT Test Developer" -T /usr/bin/codesign -P
security add-certificates -k ~/Library/Keychains/login.keychain-db

# 인증서 확인
echo "🔍 생성된 인증서 확인..."
security find-identity -v -p codesigning

if [ $? -eq 0 ]; then
    echo "✅ 인증서 생성 성공!"
else
    echo "❌ 인증서 생성 실패. 수동으로 생성해야 합니다."
    echo ""
    echo "🔧 수동 생성 방법:"
    echo "1. Keychain Access 앱 열기"
    echo "2. Certificate Assistant > Create a Certificate..."
    echo "3. Name: AWS IoT Test Developer"
    echo "4. Identity Type: Self Signed Root"
    echo "5. Certificate Type: Code Signing"
    echo "6. Create"
fi