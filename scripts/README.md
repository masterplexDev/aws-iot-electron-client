# 📜 스크립트 가이드

## 🚀 사용 가능한 스크립트들

### **빌드 스크립트**

#### `build_macos_dmg.sh` - macOS DMG 빌드
```bash
# DMG 파일만 빌드 (GitHub Release용)
./scripts/build_macos_dmg.sh
# 또는
npm run dmg
```

**생성 파일:**
- `AWS IoT Core 테스트 클라이언트-1.0.0-arm64.dmg` (M1/M2 Mac)
- `AWS IoT Core 테스트 클라이언트-1.0.0-x64.dmg` (Intel Mac)

### **개발 스크립트**

#### `start_web.sh` - 웹 버전 실행
```bash
# 브라우저에서 웹 버전 실행
./scripts/start_web.sh
# 또는
npm run web
```

**특징:**
- Electron 없이 브라우저에서 실행
- 개발 및 테스트용
- 파일 시스템 접근 제한 (인증서 파일 직접 입력 필요)

## 📋 npm 스크립트

```bash
# 개발 모드 (Electron)
npm run dev

# 웹 버전
npm run web

# DMG 빌드
npm run dmg

# 전체 플랫폼 빌드
npm run dist:all
```

## 🎯 사용 시나리오

### **개발 중**
```bash
npm run dev          # Electron 개발 모드
npm run web          # 웹 버전 테스트
```

### **배포 준비**
```bash
npm run dmg          # macOS DMG 빌드
```

### **GitHub Release 업로드**
1. `npm run dmg` 실행
2. `release/` 폴더의 DMG 파일들 확인
3. GitHub Release에 업로드