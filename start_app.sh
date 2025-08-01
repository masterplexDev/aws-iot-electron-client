#!/bin/bash

# AWS IoT Core 테스트 클라이언트 실행 스크립트
# M1 Pro에서 빌드된 앱이 크래시하는 문제를 우회하기 위해 개발 모드 사용

echo "🚀 AWS IoT Core 테스트 클라이언트 시작 중..."
echo "💡 M1 Pro 호환성 문제로 인해 개발 모드로 실행됩니다."
echo ""

# 기존 프로세스 확인 및 종료
echo "🔍 기존 프로세스 확인 중..."
existing_pid=$(pgrep -f "aws-iot-electron-client")
if [ ! -z "$existing_pid" ]; then
    echo "   ⚠️  기존 프로세스 발견: $existing_pid"
    echo "   🔄 기존 프로세스 종료 중..."
    pkill -f "aws-iot-electron-client"
    sleep 2
fi

# 프로젝트 디렉토리로 이동
cd "$(dirname "$0")"

# 의존성 확인
if [ ! -d "node_modules" ]; then
    echo "📦 의존성 설치 중..."
    npm install
fi

# 앱 실행
echo "✅ 앱 실행 중..."
echo "   - Vite 개발 서버: http://localhost:5173"
echo "   - Electron 메인 프로세스: 백그라운드"
echo ""
echo "📝 참고: 이 방법은 개발 모드이므로 모든 기능이 정상 작동합니다."
echo "🔧 빌드 문제가 해결되면 dist 명령어로 배포용 앱을 생성할 수 있습니다."
echo ""

# 개발 모드 실행
npm run dev

echo ""
echo "✅ 앱이 종료되었습니다."