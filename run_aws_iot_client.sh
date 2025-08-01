#!/bin/bash

# AWS IoT Core 테스트 클라이언트 통합 실행 스크립트
# 모든 플랫폼과 모든 상황에서 실행 가능하도록 설계

echo "🚀 AWS IoT Core 테스트 클라이언트 실행 중..."
echo "🌍 플랫폼: $(uname -s) $(uname -m)"

# 현재 디렉토리로 이동
cd "$(dirname "$0")"

# 플랫폼 감지
PLATFORM=$(uname -s)
ARCH=$(uname -m)

case "$PLATFORM" in
    "Darwin")
        echo "🍎 macOS 감지 - 여러 방법으로 시도합니다..."
        
        # 방법 1: 빌드된 앱이 있는지 확인
        if [ -d "release/mac-arm64/AWS IoT Core 테스트 클라이언트.app" ]; then
            echo "📱 방법 1: 빌드된 macOS 앱 실행 시도..."
            
            # 보안 우회 스크립트 실행
            if [ -f "ultimate_macos_fix.sh" ]; then
                echo "   🛡️  보안 설정 적용 중..."
                ./ultimate_macos_fix.sh > /dev/null 2>&1
            fi
            
            # 환경변수와 함께 실행 시도
            echo "   🔧 환경변수 포함 실행 시도..."
            DYLD_FORCE_LOAD=1 DYLD_IGNORE_WEAK_SYMBOLS=1 \
            "release/mac-arm64/AWS IoT Core 테스트 클라이언트.app/Contents/MacOS/AWS IoT Core 테스트 클라이언트" &
            
            sleep 3
            if pgrep -f "AWS IoT Core" > /dev/null; then
                echo "   ✅ macOS 앱 실행 성공!"
                exit 0
            else
                echo "   ❌ macOS 앱 실행 실패 - 개발 모드로 전환..."
            fi
        fi
        
        # 방법 2: 개발 모드 (권장)
        echo "📱 방법 2: 개발 모드 실행..."
        if [ -f "start_app.sh" ]; then
            ./start_app.sh
        else
            npm run dev
        fi
        ;;
        
    "Linux")
        echo "🐧 Linux 감지 - AppImage 또는 개발 모드로 실행..."
        
        # Linux 빌드된 앱 확인
        if ls release/*.AppImage 2>/dev/null || ls release/*.deb 2>/dev/null; then
            echo "📱 빌드된 Linux 앱 실행..."
            
            # AppImage 실행
            if ls release/*.AppImage 2>/dev/null; then
                APP_IMAGE=$(ls release/*.AppImage | head -1)
                chmod +x "$APP_IMAGE"
                "$APP_IMAGE" &
                echo "✅ AppImage 실행: $APP_IMAGE"
                exit 0
            fi
            
            # .deb 설치 안내
            if ls release/*.deb 2>/dev/null; then
                DEB_FILE=$(ls release/*.deb | head -1)
                echo "📦 .deb 파일 설치 후 실행:"
                echo "   sudo dpkg -i $DEB_FILE"
                echo "   aws-iot-core-test-client"
            fi
        else
            echo "📱 개발 모드로 실행..."
            npm run dev
        fi
        ;;
        
    "MINGW"*|"CYGWIN"*|"MSYS"*)
        echo "🪟 Windows 감지 - 빌드된 앱 또는 개발 모드로 실행..."
        
        # Windows 빌드된 앱 확인
        if ls release/*.exe 2>/dev/null; then
            EXE_FILE=$(ls release/*.exe | head -1)
            echo "📱 Windows 앱 실행: $EXE_FILE"
            "$EXE_FILE" &
            exit 0
        else
            echo "📱 개발 모드로 실행..."
            npm run dev
        fi
        ;;
        
    *)
        echo "❓ 알 수 없는 플랫폼 - 개발 모드로 실행..."
        npm run dev
        ;;
esac