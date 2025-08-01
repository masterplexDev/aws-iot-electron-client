# AWS IoT Core 테스트 클라이언트 - 빌드 가이드

## 개발 환경 설정

### 필수 요구사항
- Node.js 18.x 이상
- npm 또는 yarn
- Git

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 모드 실행
npm run dev

# TypeScript 컴파일 (Electron 메인 프로세스)
npm run build:electron

# React 앱 빌드 (렌더러 프로세스)
npm run build:vite
```

## 배포용 빌드

### 전체 빌드
```bash
# 모든 소스 빌드
npm run build
```

### 플랫폼별 배포 패키지 생성

#### macOS 빌드
```bash
# macOS DMG + ZIP 생성 (Intel x64 + Apple Silicon arm64)
npm run dist:mac
```
- 생성되는 파일:
  - `release/AWS IoT Core 테스트 클라이언트-1.0.0.dmg`
  - `release/AWS IoT Core 테스트 클라이언트-1.0.0-mac.zip`

#### Windows 빌드
```bash
# Windows NSIS 인스톨러 + Portable 생성 (x64 + x86)
npm run dist:win
```
- 생성되는 파일:
  - `release/AWS IoT Core 테스트 클라이언트 Setup 1.0.0.exe` (인스톨러)
  - `release/AWS IoT Core 테스트 클라이언트 1.0.0.exe` (포터블)

#### 멀티 플랫폼 빌드
```bash
# macOS + Windows 동시 빌드
npm run dist:all
```

### 테스트용 언패키지 빌드
```bash
# 실행 파일만 생성 (설치 패키지 없이)
npm run pack
```

## 빌드 결과물

모든 빌드 결과물은 `release/` 디렉토리에 생성됩니다:

```
release/
├── mac/                          # macOS 앱 번들
├── win-unpacked/                 # Windows 언패키지 앱
├── AWS IoT Core 테스트 클라이언트-1.0.0.dmg      # macOS DMG
├── AWS IoT Core 테스트 클라이언트-1.0.0-mac.zip   # macOS ZIP
├── AWS IoT Core 테스트 클라이언트 Setup 1.0.0.exe # Windows 인스톨러
└── AWS IoT Core 테스트 클라이언트 1.0.0.exe       # Windows 포터블
```

## 빌드 설정

빌드 설정은 `package.json`의 `build` 섹션에서 관리됩니다:

- **앱 ID**: `com.awsiot.testclient`
- **제품명**: `AWS IoT Core 테스트 클라이언트`
- **지원 아키텍처**: 
  - macOS: x64, arm64 (Apple Silicon)
  - Windows: x64, ia32 (x86)

## 코드 서명 및 공증 (선택사항)

### macOS
- 개발자 계정이 있는 경우 `build/entitlements.mac.plist` 파일을 통해 앱 권한 설정
- Apple Developer ID를 통한 코드 서명 가능

### Windows
- 코드 서명 인증서가 있는 경우 자동 서명 설정 가능

## 빌드 성공 확인

### 🎉 전체 플랫폼 빌드 완료!

모든 플랫폼에서 성공적으로 빌드되었습니다:

#### macOS 빌드 ✅
**Intel Mac (x64):**
- `AWS IoT Core 테스트 클라이언트-1.0.0.dmg` (130 MB)
- `AWS IoT Core 테스트 클라이언트-1.0.0-mac.zip` (145 MB)

**Apple Silicon (arm64):**
- `AWS IoT Core 테스트 클라이언트-1.0.0-arm64.dmg` (128 MB)
- `AWS IoT Core 테스트 클라이언트-1.0.0-arm64-mac.zip` (129 MB)

#### Windows 빌드 ✅
**x64 + x86 통합:**
- `AWS IoT Core 테스트 클라이언트 Setup 1.0.0.exe` (207 MB) - NSIS 인스톨러
- `AWS IoT Core 테스트 클라이언트 1.0.0.exe` (191 MB) - 포터블 실행파일

### AWS IoT Core 공식 아이콘 적용 ✅

- **아이콘**: AWS IoT Core 공식 녹색 클라우드 + IoT 디바이스 아이콘
- **파일 포맷**: macOS (.icns), Windows (.ico), Linux (.png)
- **해상도**: 16x16부터 1024x1024까지 모든 크기 지원

## 주의사항

1. **AWS IoT Device SDK v2**: Native 모듈이 포함되어 있어 플랫폼별 바이너리가 필요합니다.
2. **Node.js 버전**: Electron과 호환되는 Node.js 버전을 사용해야 합니다.
3. **크로스 플랫폼 빌드**: 
   - macOS에서 Windows 빌드 시 Wine이 필요할 수 있습니다.
   - 최상의 결과를 위해서는 각 플랫폼에서 네이티브 빌드를 권장합니다.
4. **코드 서명**: macOS 빌드는 서명되지 않았으므로 "확인되지 않은 개발자" 경고가 나타날 수 있습니다.

## 설치 및 테스트 가이드

### macOS 설치
1. **DMG 파일**: `AWS IoT Core 테스트 클라이언트-1.0.0.dmg` 더블클릭
2. **드래그 앤 드롭**: 애플리케이션을 Applications 폴더로 드래그
3. **보안 경고 해결** (중요!):

#### 방법 1: 자동 해결 스크립트 사용
```bash
# 프로젝트 디렉토리에서 실행
./fix_macos_quarantine.sh
```

#### 방법 2: 수동 해결
```bash
# 1. Quarantine 속성 제거
sudo xattr -r -d com.apple.quarantine "/Applications/AWS IoT Core 테스트 클라이언트.app"

# 2. 앱 실행
open "/Applications/AWS IoT Core 테스트 클라이언트.app"
```

#### 방법 3: 시스템 설정 (보안 경고 시)
- `시스템 환경설정 > 보안 및 개인정보 보호`에서 "확인되지 않은 개발자" 허용
- 또는 Control+클릭으로 앱을 우클릭하여 "열기" 선택

### Windows 설치
1. **인스톨러**: `AWS IoT Core 테스트 클라이언트 Setup 1.0.0.exe` 실행
2. **포터블**: `AWS IoT Core 테스트 클라이언트 1.0.0.exe` 직접 실행 (설치 불필요)
3. **보안 경고**: Windows Defender SmartScreen 경고 시 "추가 정보 > 실행" 클릭

### 기본 사용법
1. **엔드포인트 입력**: AWS IoT Core 엔드포인트 URL
2. **인증서 선택**: 디바이스 인증서 (.crt) 및 개인키 (.key) 파일
3. **연결**: "연결" 버튼 클릭
4. **메시지 테스트**: 
   - **발행**: Messaging 탭에서 토픽과 JSON 메시지 입력 후 "발행"
   - **구독**: 원하는 토픽 입력 후 "구독", 실시간 메시지 수신 확인

## 문제 해결

### macOS 실행 크래시 문제 ⚠️
**증상**: 앱이 시작 시 `EXC_BREAKPOINT (SIGTRAP)` 오류로 크래시

**해결 방법**:
1. **Quarantine 속성 제거** (권장):
   ```bash
   sudo xattr -r -d com.apple.quarantine "/Applications/AWS IoT Core 테스트 클라이언트.app"
   ```

2. **자동 해결 스크립트 사용**:
   ```bash
   ./fix_macos_quarantine.sh
   ```

3. **Gatekeeper 임시 비활성화** (주의):
   ```bash
   sudo spctl --master-disable
   # 사용 후 다시 활성화: sudo spctl --master-enable
   ```

### 빌드 실패 시
```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# 빌드 캐시 정리
rm -rf dist/ release/
npm run build
```

### 네이티브 모듈 오류 시
```bash
# 플랫폼별 네이티브 모듈 재빌드
npm rebuild
```

### AWS IoT 연결 문제
1. **엔드포인트 확인**: AWS IoT Core 콘솔에서 올바른 엔드포인트 URL 확인
2. **인증서 유효성**: 디바이스 인증서가 활성화되어 있는지 확인
3. **네트워크 방화벽**: 8883 포트(MQTT over TLS)가 열려있는지 확인