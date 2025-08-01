#!/bin/bash

# AWS IoT Core 테스트 클라이언트 웹 버전 실행 스크립트
# Electron 없이 브라우저에서 직접 실행

echo "🌐 AWS IoT Core 테스트 클라이언트 (웹 버전) 시작 중..."
echo ""

# 프로젝트 디렉토리로 이동
cd "$(dirname "$0")"

# 의존성 확인
if [ ! -d "node_modules" ]; then
    echo "📦 의존성 설치 중..."
    npm install
fi

# 기존 Vite 프로세스 종료
echo "🔍 기존 Vite 프로세스 확인 중..."
existing_vite=$(pgrep -f "vite")
if [ ! -z "$existing_vite" ]; then
    echo "   ⚠️  기존 Vite 프로세스 발견: $existing_vite"
    echo "   🔄 기존 프로세스 종료 중..."
    pkill -f "vite"
    sleep 2
fi

# Vite 개발 서버만 실행
echo "✅ 웹 서버 시작 중..."
echo "   - URL: http://localhost:5173"
echo "   - 브라우저에서 자동으로 열립니다"
echo ""
echo "📝 참고: 웹 버전에서는 파일 시스템 접근이 제한되므로"
echo "🔧 인증서 파일 내용을 직접 텍스트로 입력해야 합니다."
echo ""

# Vite만 실행하고 브라우저 열기
npm run dev:vite &
sleep 3
open http://localhost:5173

# Vite 프로세스 대기
wait

echo ""
echo "✅ 웹 서버가 종료되었습니다."