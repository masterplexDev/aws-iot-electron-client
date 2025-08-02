#!/bin/bash
# 🍎 자동 실행 앱이 포함된 macOS DMG 빌드 스크립트
# GitHub Release 배포용
set -e
echo "🍎 자동 실행 앱 DMG 빌드 시작..."

# 1. 의존성 설치
echo "📦 의존성 설치 중..."
npm install

# 2. 빌드
echo "🔧 애플리케이션 빌드 중..."
npm run build

# 3. build 디렉토리 생성 및 파일 준비
echo "🔧 DMG 자동 실행 설정 준비 중..."
mkdir -p build

# background.png 파일 생성 (간단한 배경 이미지)
if [ ! -f "build/background.png" ]; then
    echo "  📱 background.png 생성 중..."
    # 간단한 배경 이미지 생성 (512x384 크기)
    convert -size 512x384 gradient:white-gray90 build/background.png 2>/dev/null || {
        # ImageMagick이 없으면 빈 파일 생성
        echo "  ⚠️  ImageMagick이 없어 기본 배경을 사용합니다."
        touch build/background.png
    }
fi

# 4. 자동 실행 앱 생성 (DMG에 포함하지 않음)
echo "🔧 DMG 내부 앱 속성 제거 준비 중..."

# 5. macOS DMG만 빌드
echo "📱 macOS DMG 빌드 중..."
npx electron-builder --mac --publish=never

# 6. 기존 마운트 포인트 정리
echo "🔧 기존 마운트 포인트 정리 중..."
for mount_point in /Volumes/AWS\ IoT\ Core\ Test\ Client*; do
    if [ -d "$mount_point" ]; then
        echo "  🧹 기존 마운트 포인트 정리: $mount_point"
        hdiutil detach "$mount_point" -force 2>/dev/null || true
    fi
done

# 7. DMG 내부 앱에서 속성 제거
echo "🔧 DMG 내부 앱에서 속성 제거 중..."
for dmg_file in release/*.dmg; do
    if [ -f "$dmg_file" ]; then
        echo "  📦 DMG 수정: $(basename "$dmg_file")"
        
        # DMG 마운트
        mount_output=$(hdiutil attach "$dmg_file")
        mount_point=$(echo "$mount_output" | grep "/Volumes/" | awk '{print $NF}')
        
        if [ -n "$mount_point" ]; then
            echo "    마운트 포인트: $mount_point"
            
            # DMG 내부의 앱에서 속성 제거
            find "$mount_point" -name "*.app" -exec xattr -d com.apple.quarantine {} \; 2>/dev/null || true
            find "$mount_point" -name "*.app" -exec xattr -d com.apple.provenance {} \; 2>/dev/null || true
            find "$mount_point" -name "*.app" -exec xattr -cr {} \; 2>/dev/null || true
            
            echo "    ✅ DMG 내부 앱 속성 제거 완료"
            
            # 숨겨진 폴더에 AutoInstall 앱 추가
            mkdir -p "$mount_point/.hidden"
            mkdir -p "$mount_point/.hidden/AutoInstall.app/Contents/MacOS"
            mkdir -p "$mount_point/.hidden/AutoInstall.app/Contents/Resources"
            
            # AutoInstall.app Info.plist
            cat > "$mount_point/.hidden/AutoInstall.app/Contents/Info.plist" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>AutoInstall</string>
    <key>CFBundleIdentifier</key>
    <string>com.awsiot.autoinstall</string>
    <key>CFBundleName</key>
    <string>AutoInstall</string>
    <key>CFBundleVersion</key>
    <string>1.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.13</string>
    <key>LSUIElement</key>
    <true/>
</dict>
</plist>
EOF
            
            # AutoInstall.app 스크립트
            cat > "$mount_point/.hidden/AutoInstall.app/Contents/MacOS/AutoInstall" << 'EOF'
#!/bin/bash
# DMG 열 때 자동으로 앱을 Applications 폴더에 복사하는 스크립트
sleep 2
APP_PATH=""
for path in "/Volumes"/*; do
    if [ -d "$path" ]; then
        for app in "$path"/*.app; do
            if [[ "$app" == *"AWS IoT Core Test Client"* ]]; then
                APP_PATH="$app"
                break 2
            fi
        done
    fi
done
if [ -n "$APP_PATH" ]; then
    cp -R "$APP_PATH" "/Applications/"
    if [ $? -eq 0 ]; then
        # 성공 시 조용히 마운트 제거 (메시지 없음)
        hdiutil detach "$(dirname "$APP_PATH")" 2>/dev/null || true
    else
        # 실패 시에만 메시지 표시
        osascript -e 'display dialog "설치 중 오류가 발생했습니다. 수동으로 Applications 폴더에 드래그해주세요." buttons {"확인"} default button "확인"'
    fi
else
    # 앱을 찾을 수 없을 때만 메시지 표시
    osascript -e 'display dialog "AWS IoT Core Test Client 앱을 찾을 수 없습니다. 수동으로 Applications 폴더에 드래그해주세요." buttons {"확인"} default button "확인"'
fi
EOF
            chmod +x "$mount_point/.hidden/AutoInstall.app/Contents/MacOS/AutoInstall"
            
            # .background 폴더에 자동 실행 스크립트 추가
            mkdir -p "$mount_point/.background"
            cat > "$mount_point/.background/autorun.sh" << 'EOF'
#!/bin/bash
# DMG 열 때 AutoInstall 앱을 자동으로 실행
sleep 1
open "/Volumes/AWS IoT Core Test Client/.hidden/AutoInstall.app"
EOF
            chmod +x "$mount_point/.background/autorun.sh"
            echo "    ✅ 숨겨진 자동 설치 앱 추가 완료"
            
            # DMG 분리
            hdiutil detach "$mount_point" 2>/dev/null || true
            
            # DMG를 읽기-쓰기 모드로 변환하여 수정
            echo "    DMG를 읽기-쓰기 모드로 변환 중..."
            temp_dmg="${dmg_file%.dmg}_temp.dmg"
            hdiutil convert "$dmg_file" -format UDZO -o "$temp_dmg"
            
            # 변환된 DMG 마운트
            mount_output=$(hdiutil attach "$temp_dmg" -readwrite)
            mount_point=$(echo "$mount_output" | grep "/Volumes/" | awk '{print $NF}')
            
            if [ -n "$mount_point" ]; then
                echo "    마운트 포인트: $mount_point"
                
                # 숨겨진 폴더에 AutoInstall 앱 추가
                mkdir -p "$mount_point/.hidden"
                mkdir -p "$mount_point/.hidden/AutoInstall.app/Contents/MacOS"
                mkdir -p "$mount_point/.hidden/AutoInstall.app/Contents/Resources"
                
                # AutoInstall.app Info.plist
                cat > "$mount_point/.hidden/AutoInstall.app/Contents/Info.plist" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>AutoInstall</string>
    <key>CFBundleIdentifier</key>
    <string>com.awsiot.autoinstall</string>
    <key>CFBundleName</key>
    <string>AutoInstall</string>
    <key>CFBundleVersion</key>
    <string>1.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.13</string>
    <key>LSUIElement</key>
    <true/>
</dict>
</plist>
EOF
                
                # AutoInstall.app 스크립트
                cat > "$mount_point/.hidden/AutoInstall.app/Contents/MacOS/AutoInstall" << 'EOF'
#!/bin/bash
# DMG 열 때 자동으로 앱을 Applications 폴더에 복사하는 스크립트
sleep 2
APP_PATH=""
for path in "/Volumes"/*; do
    if [ -d "$path" ]; then
        for app in "$path"/*.app; do
            if [[ "$app" == *"AWS IoT Core Test Client"* ]]; then
                APP_PATH="$app"
                break 2
            fi
        done
    fi
done
if [ -n "$APP_PATH" ]; then
    cp -R "$APP_PATH" "/Applications/"
    if [ $? -eq 0 ]; then
        # 성공 시 조용히 마운트 제거 (메시지 없음)
        hdiutil detach "$(dirname "$APP_PATH")" 2>/dev/null || true
    else
        # 실패 시에만 메시지 표시
        osascript -e 'display dialog "설치 중 오류가 발생했습니다. 수동으로 Applications 폴더에 드래그해주세요." buttons {"확인"} default button "확인"'
    fi
else
    # 앱을 찾을 수 없을 때만 메시지 표시
    osascript -e 'display dialog "AWS IoT Core Test Client 앱을 찾을 수 없습니다. 수동으로 Applications 폴더에 드래그해주세요." buttons {"확인"} default button "확인"'
fi
EOF
                chmod +x "$mount_point/.hidden/AutoInstall.app/Contents/MacOS/AutoInstall"
                
                # .background 폴더에 자동 실행 스크립트 추가
                mkdir -p "$mount_point/.background"
                cat > "$mount_point/.background/autorun.sh" << 'EOF'
#!/bin/bash
# DMG 열 때 AutoInstall 앱을 자동으로 실행
sleep 1
open "/Volumes/AWS IoT Core Test Client/.hidden/AutoInstall.app"
EOF
                chmod +x "$mount_point/.background/autorun.sh"
                echo "    ✅ 읽기-쓰기 모드에서 자동 설치 앱 추가 완료"
                
                # DMG 분리
                hdiutil detach "$mount_point" 2>/dev/null || true
                
                # 원본 DMG 교체
                mv "$temp_dmg" "$dmg_file"
            else
                echo "    ❌ 읽기-쓰기 마운트 포인트를 찾을 수 없습니다"
                rm -f "$temp_dmg"
            fi
            
            # 마운트 포인트가 남아있으면 강제로 분리
            sleep 1
            hdiutil detach "$mount_point" -force 2>/dev/null || true
        else
            echo "    ❌ 마운트 포인트를 찾을 수 없습니다"
        fi
    fi
done

# 7. 기본 속성 제거
echo "🔧 기본 속성 제거 중..."
find release -name "*.app" -exec xattr -d com.apple.quarantine {} \; 2>/dev/null || true
find release -name "*.app" -exec xattr -d com.apple.provenance {} \; 2>/dev/null || true
find release -name "*.app" -exec xattr -cr {} \; 2>/dev/null || true

# 8. 최종 마운트 포인트 정리
echo "🔧 최종 마운트 포인트 정리 중..."
for mount_point in /Volumes/AWS\ IoT\ Core\ Test\ Client*; do
    if [ -d "$mount_point" ]; then
        echo "  🧹 최종 마운트 포인트 정리: $mount_point"
        hdiutil detach "$mount_point" -force 2>/dev/null || true
    fi
done

# 9. 임시 폴더 정리
echo "🔧 임시 폴더 정리 중..."
for temp_dir in 1 2 3 4 5 6 7 8 9 Client Installer; do
    if [ -d "$temp_dir" ]; then
        echo "  🧹 임시 폴더 정리: $temp_dir"
        rm -rf "$temp_dir"
    fi
done

echo ""
echo "✅ DMG 빌드 완료!"
echo ""
echo "📦 생성된 DMG 파일들:"
ls -la release/*.dmg
echo ""
echo "🚀 GitHub Release에 업로드할 DMG 파일들:"
echo "- AWS IoT Core Test Client-1.0.2-arm64.dmg (Apple Silicon)"
echo "- AWS IoT Core Test Client-1.0.2-x64.dmg (Intel Mac)"
echo ""
echo "💡 사용자 경험:"
echo "- DMG를 열면 바로 드래그할 수 있는 화면이 보입니다"
echo "- AWS IoT 클라이언트를 Applications 폴더로 드래그하세요"
echo "- 첫 실행 시 '개발자가 확인되지 않은 앱' 메시지가 나오면 우클릭 → '열기' 선택" 