# 📦 GitHub Release 배포 가이드

## 🚀 1단계: GitHub Repository 생성

1. **GitHub.com** 접속 → **New Repository**
2. Repository 이름: `aws-iot-electron-client`
3. **Public**으로 설정 (무료 배포용)
4. **Create repository**

## 📁 2단계: 코드 업로드

```bash
# 현재 폴더에서 실행
git init
git add .
git commit -m "Initial commit: AWS IoT Core Test Client"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aws-iot-electron-client.git
git push -u origin main
```

## 🏷️ 3단계: Release 생성

### GitHub 웹에서:
1. **Repository** → **Releases** → **Create a new release**
2. **Tag**: `v1.0.0`
3. **Title**: `AWS IoT Core 테스트 클라이언트 v1.0.0`
4. **Description**:
   ```markdown
   ## 🎉 AWS IoT Core 테스트 클라이언트 첫 번째 릴리즈!
   
   ### ✨ 주요 기능
   - 🔐 AWS IoT Core mTLS 인증 연결
   - 📡 MQTT 메시지 발행/구독
   - 📊 실시간 메시지 모니터링
   - 💾 엔드포인트 설정 자동 저장
   - 🎨 Dark 테마 UI (shadcn/ui)
   
   ### 📥 다운로드
   - **macOS (Apple Silicon)**: ARM64 버전 다운로드
   - **macOS (Intel)**: x64 버전 다운로드
   - **DMG**: 설치 파일 형태
   - **ZIP**: 압축 파일 형태 (보안 경고 적음)
   
   ### ⚠️ 첫 실행 시 주의사항
**"개발자가 확인되지 않은 앱" 메시지가 나타나면:**
   
   #### 방법 1: 우클릭으로 열기 (가장 간단)
   1. 앱을 **우클릭** (또는 Control+클릭)
   2. **"열기"** 선택
   3. **"열기"** 버튼 클릭
   
   #### 방법 2: 시스템 환경설정에서 허용
   1. **시스템 환경설정** → **보안 및 개인 정보 보호**
   2. **일반** 탭에서 **"확인 없이 열기"** 클릭
   
   #### 방법 3: 터미널에서 보안 속성 제거
   ```bash
   xattr -cr "AWS IoT Core 테스트 클라이언트.app"
   ```
   
   **이는 정상적인 macOS 보안 기능입니다. 다른 오픈소스 앱들과 동일한 경고입니다!**
   ```

### 5단계: 파일 업로드
다음 DMG 파일들을 **Release assets**에 업로드:

```bash
# 업로드할 DMG 파일들
release/AWS IoT Core 테스트 클라이언트-1.0.0-arm64.dmg
release/AWS IoT Core 테스트 클라이언트-1.0.0-x64.dmg
```

## 🌐 4단계: 다운로드 페이지 배포

### GitHub Pages 사용:
1. **Repository** → **Settings** → **Pages**
2. **Source**: `Deploy from a branch`
3. **Branch**: `main` → **/ (root)**
4. `download-page.html`을 `index.html`로 이름 변경
5. 몇 분 후 `https://YOUR_USERNAME.github.io/aws-iot-electron-client` 접속

### 또는 Netlify/Vercel 사용:
- 더 빠르고 편리한 배포
- 커스텀 도메인 설정 가능

## 📊 5단계: 다운로드 추적 (선택사항)

### GitHub API로 다운로드 수 확인:
```bash
curl -s https://api.github.com/repos/YOUR_USERNAME/aws-iot-electron-client/releases/latest
```

## 🔄 6단계: 업데이트 배포

새 버전 릴리즈:
```bash
# 새 버전 빌드 (DMG만)
npm run dist:mac:dmg

# 새 Release 생성 (v1.0.1, v1.1.0 등)
# DMG 파일 업로드 반복
```

## 🎯 완성된 배포 구조

```
📦 aws-iot-electron-client (GitHub Repository)
├── 🌐 https://username.github.io/aws-iot-electron-client (다운로드 페이지)
├── 🏷️ Releases
│   ├── v1.0.0
│   │   ├── 📱 arm64.dmg (Apple Silicon)
│   │   └── 📱 x64.dmg (Intel Mac)
│   └── 📈 Download Statistics
└── 📖 README.md (설치 가이드)
```

**이제 완전한 오픈소스 배포 완성!** 🎉