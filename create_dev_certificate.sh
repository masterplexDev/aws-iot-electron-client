#!/bin/bash

# AWS IoT Core 테스트 클라이언트용 개발자 인증서 생성 스크립트
# macOS 보안 정책(AMFI, Hardened Runtime, SIP)을 우회하기 위한 self-signed 인증서

echo "🔐 개발자 인증서 생성 중..."

# 인증서 정보
CERT_NAME="AWS IoT Core Test Client Developer"
CERT_IDENTIFIER="com.awsiot.testclient.developer"
KEYCHAIN="login.keychain"

# 기존 인증서 삭제 (있다면)
echo "🗑️  기존 인증서 정리..."
security delete-certificate -c "$CERT_NAME" $KEYCHAIN 2>/dev/null || true
security delete-identity -c "$CERT_NAME" $KEYCHAIN 2>/dev/null || true

# 임시 설정 파일 생성
cat > /tmp/cert_config.conf << EOF
[ req ]
default_bits = 2048
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[ req_distinguished_name ]
C=KR
ST=Seoul
L=Seoul
O=AWS IoT Core Test Client
OU=Development
CN=$CERT_NAME
emailAddress=developer@awsiot.local

[ v3_req ]
keyUsage = keyEncipherment, dataEncipherment, digitalSignature
extendedKeyUsage = codeSigning
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = localhost
DNS.2 = *.local
EOF

# 1. 개인키 생성
echo "🔑 개인키 생성 중..."
openssl genrsa -out /tmp/dev_cert.key 2048

# 2. 인증서 서명 요청(CSR) 생성
echo "📝 인증서 서명 요청 생성 중..."
openssl req -new -key /tmp/dev_cert.key -out /tmp/dev_cert.csr -config /tmp/cert_config.conf

# 3. Self-signed 인증서 생성 (10년 유효)
echo "📜 Self-signed 인증서 생성 중..."
openssl x509 -req -days 3650 -in /tmp/dev_cert.csr -signkey /tmp/dev_cert.key -out /tmp/dev_cert.crt -extensions v3_req -extfile /tmp/cert_config.conf

# 4. PKCS#12 형식으로 변환 (키체인 가져오기용)
echo "🔄 PKCS#12 형식으로 변환 중..."
openssl pkcs12 -export -out /tmp/dev_cert.p12 -inkey /tmp/dev_cert.key -in /tmp/dev_cert.crt -name "$CERT_NAME" -passout pass:

# 5. 키체인에 인증서 가져오기
echo "🔐 키체인에 인증서 가져오기..."
security import /tmp/dev_cert.p12 -k $KEYCHAIN -f pkcs12 -A -T /usr/bin/codesign -T /usr/bin/security

# 6. 인증서 신뢰 설정
echo "✅ 인증서 신뢰 설정..."
security add-trusted-cert -d -r trustRoot -k $KEYCHAIN /tmp/dev_cert.crt

# 7. 코드 서명 권한 부여
echo "🔧 코드 서명 권한 부여..."
security set-key-partition-list -S apple-tool:,apple: -s -k "" $KEYCHAIN

# 8. 임시 파일 정리
echo "🧹 임시 파일 정리..."
rm -f /tmp/dev_cert.* /tmp/cert_config.conf

# 9. 생성된 인증서 확인
echo "🔍 생성된 인증서 확인..."
security find-identity -v -p codesigning

echo ""
echo "✅ 개발자 인증서 생성 완료!"
echo "📌 인증서 이름: $CERT_NAME"
echo "🔗 식별자: $CERT_IDENTIFIER"
echo ""
echo "🚀 이제 이 인증서로 코드 서명이 가능합니다."