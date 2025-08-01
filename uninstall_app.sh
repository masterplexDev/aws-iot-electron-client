#!/bin/bash

# AWS IoT Core 테스트 클라이언트 완전 삭제 스크립트

echo "🗑️  AWS IoT Core 테스트 클라이언트 완전 삭제 중..."

# 1. 실행 중인 앱 프로세스 종료
echo "1️⃣  실행 중인 앱 프로세스 종료..."
pkill -f "AWS IoT Core" 2>/dev/null || true
pkill -f "com.awsiot.testclient" 2>/dev/null || true
sleep 2

# 2. 메인 앱 삭제
echo "2️⃣  메인 애플리케이션 삭제..."
if [ -d "/Applications/AWS IoT Core 테스트 클라이언트.app" ]; then
    sudo rm -rf "/Applications/AWS IoT Core 테스트 클라이언트.app"
    echo "   ✅ 메인 앱 삭제 완료"
else
    echo "   ℹ️  메인 앱이 없습니다"
fi

# 3. 사용자 데이터 및 설정 삭제
echo "3️⃣  사용자 데이터 및 설정 삭제..."
USER_HOME=$(eval echo ~$USER)

# Electron 앱 데이터 경로들
PATHS_TO_DELETE=(
    "$USER_HOME/Library/Application Support/AWS IoT Core 테스트 클라이언트"
    "$USER_HOME/Library/Application Support/com.awsiot.testclient"
    "$USER_HOME/Library/Preferences/com.awsiot.testclient.plist"
    "$USER_HOME/Library/Preferences/AWS IoT Core 테스트 클라이언트.plist"
    "$USER_HOME/Library/Saved Application State/com.awsiot.testclient.savedState"
    "$USER_HOME/Library/Caches/com.awsiot.testclient"
    "$USER_HOME/Library/Caches/AWS IoT Core 테스트 클라이언트"
    "$USER_HOME/Library/Logs/AWS IoT Core 테스트 클라이언트"
    "$USER_HOME/Library/WebKit/com.awsiot.testclient"
)

for path in "${PATHS_TO_DELETE[@]}"; do
    if [ -e "$path" ]; then
        rm -rf "$path" 2>/dev/null || true
        echo "   ✅ 삭제: $path"
    fi
done

# 4. 마운트된 DMG 언마운트
echo "4️⃣  마운트된 DMG 언마운트..."
mounted_dmg=$(mount | grep "AWS IoT Core" | awk '{print $3}')
if [ ! -z "$mounted_dmg" ]; then
    hdiutil detach "$mounted_dmg" 2>/dev/null || true
    echo "   ✅ DMG 언마운트 완료"
fi

# 5. 휴지통 비우기 (선택사항)
echo "5️⃣  휴지통에서 관련 파일 확인..."
trash_items=$(find ~/.Trash -name "*AWS IoT Core*" -o -name "*awsiot*" 2>/dev/null || true)
if [ ! -z "$trash_items" ]; then
    echo "   ⚠️  휴지통에 관련 파일이 있습니다:"
    echo "$trash_items"
    echo "   💡 휴지통을 수동으로 비워주세요."
fi

echo ""
echo "✅ AWS IoT Core 테스트 클라이언트 삭제 완료!"
echo ""
echo "🔍 삭제 확인:"
echo "1. Applications 폴더에서 앱이 사라졌는지 확인"
echo "2. Spotlight 검색에서 'AWS IoT Core'로 검색해서 결과가 없는지 확인"
echo "3. 필요시 시스템 재시작"