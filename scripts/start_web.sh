#!/bin/bash

# 🌐 AWS IoT Core 테스트 클라이언트 (웹 버전)
# 브라우저에서 직접 실행

echo "🌐 웹 버전 시작 중..."

# 의존성 설치
npm install

# Vite 개발 서버 실행
echo "✅ 웹 서버 시작: http://localhost:5173"
npm run dev:vite