# AWS IoT Core 테스트 클라이언트 - 다른 Mac에서 실행하기

## 🚨 "손상된 앱" 오류 해결 방법

다른 Mac에서 앱이 "손상되었다"고 나오면 다음 방법들을 시도해보세요.

### 방법 1: 터미널 명령어 (가장 확실한 방법)

1. **터미널** 열기 (응용 프로그램 > 유틸리티 > 터미널)

2. **다음 명령어들을 순서대로 입력**:

```bash
# 격리 속성 제거
sudo xattr -rd com.apple.quarantine "/Applications/AWS IoT Core 테스트 클라이언트.app"

# Ad-hoc 서명 적용
sudo codesign --force --deep --sign - "/Applications/AWS IoT Core 테스트 클라이언트.app"
```

3. **macOS 비밀번호** 입력 (sudo 권한)

4. **완료!** 이제 Launchpad에서 앱을 정상 실행할 수 있습니다.

### 방법 2: 시스템 환경설정 (간단한 방법)

1. **시스템 환경설정** > **보안 및 개인 정보 보호**
2. **일반** 탭에서 **"확인되지 않은 개발자의 앱 허용"** 체크
3. 앱 실행 시 **"열기"** 클릭

### 방법 3: 우클릭으로 실행

1. **Applications 폴더**에서 앱 찾기
2. **우클릭** > **열기**
3. **"열기"** 클릭

## 🔧 자동화 스크립트

터미널에서 아래 스크립트를 다운로드하여 실행할 수도 있습니다:

```bash
# 스크립트 다운로드
curl -o fix_app.sh https://your-server.com/fix_app_for_other_mac.sh

# 실행 권한 부여
chmod +x fix_app.sh

# 스크립트 실행
./fix_app.sh
```

## ✅ 정상 작동 확인

앱이 실행되면:
- ✅ **AWS IoT Core 연결** 가능
- ✅ **인증서 파일 업로드** 가능 
- ✅ **MQTT 발행/구독** 정상 작동
- ✅ **실시간 메시지 모니터링**

## 🆘 문제 해결

문제가 계속 발생하면:
1. **완전 삭제** 후 재설치
2. **macOS 버전 확인** (최소 10.15 이상)
3. **M1/M2 Mac**은 **arm64** 버전 사용
4. **Intel Mac**은 **x64** 버전 사용

---
*AWS IoT Core 테스트 클라이언트 v1.0.0*