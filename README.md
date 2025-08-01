# 🚀 AWS IoT Core 테스트 클라이언트

> **AWS IoT Core와 안전한 mTLS 연결을 제공하는 현대적인 데스크톱 애플리케이션**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-20+-blue.svg)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg)](https://www.typescriptlang.org/)

![AWS IoT Client Screenshot](docs/screenshot.png)

## ✨ 주요 기능

### 🔐 **보안 연결**
- **mTLS 인증서 기반** AWS IoT Core 연결
- **클라이언트 인증서** 및 **개인키** 검증
- **루트 CA** 지원 (AWS 기본 CA 또는 커스텀)

### 📡 **MQTT 통신**
- **실시간 메시지 발행** (Publish)
- **토픽 구독** 및 **라이브 메시지 수신**
- **JSON 페이로드** 지원
- **다중 토픽** 동시 모니터링

### 📊 **실시간 모니터링**
- **연결 상태** 실시간 표시
- **메시지 피드** 라이브 업데이트
- **연결 로그** 및 **에러 추적**
- **메시지 히스토리** 저장

### 💾 **편의 기능**
- **엔드포인트 설정** 자동 저장
- **인증서 파일** 경로 기억
- **다크 테마** UI (shadcn/ui)
- **반응형 디자인**

## 📥 다운로드

### 🍎 **macOS 사용자**

| 플랫폼 | 파일 형태 | 다운로드 링크 |
|--------|-----------|---------------|
| **Apple Silicon (M1/M2)** | DMG | [다운로드](https://github.com/masterplexDev/aws-iot-electron-client/releases/latest/download/AWS%20IoT%20Core%20테스트%20클라이언트-1.0.0-arm64.dmg) |
| **Intel Mac** | DMG | [다운로드](https://github.com/masterplexDev/aws-iot-electron-client/releases/latest/download/AWS%20IoT%20Core%20테스트%20클라이언트-1.0.0-x64.dmg) |
| **Apple Silicon (M1/M2)** | ZIP | [다운로드](https://github.com/masterplexDev/aws-iot-electron-client/releases/latest/download/AWS%20IoT%20Core%20테스트%20클라이언트-1.0.0-arm64.zip) |
| **Intel Mac** | ZIP | [다운로드](https://github.com/masterplexDev/aws-iot-electron-client/releases/latest/download/AWS%20IoT%20Core%20테스트%20클라이언트-1.0.0-x64.zip) |

> 💡 **보안 경고가 적은 ZIP 파일을 권장합니다**

### ⚠️ **첫 실행 시 주의사항**

macOS에서 **"손상되었기 때문에 열 수 없습니다"** 메시지가 나타나면:

1. 🔄 **앱을 다시 한 번 더블클릭**
2. 또는 **우클릭 → "열기"** 선택

이는 정상적인 macOS 보안 기능이며, 앱 자체에는 문제가 없습니다.

## 🚀 빠른 시작

### 1. **앱 설치 및 실행**
- 위 링크에서 파일 다운로드
- DMG 파일을 열고 Applications 폴더로 드래그
- 또는 ZIP 압축 해제 후 실행

### 2. **AWS IoT 인증서 준비**
다음 파일들이 필요합니다:
```
📄 device-certificate.crt  (디바이스 인증서)
🔑 private-key.key         (개인키)
🛡️ root-CA.pem            (루트 CA - 선택사항)
```

### 3. **연결 설정**
1. **AWS IoT 엔드포인트** 입력
   ```
   예시: xxxxxxxxxxxxxx.iot.us-east-1.amazonaws.com
   ```
2. **인증서 파일** 경로 선택 (찾기 버튼 사용)
3. **연결** 버튼 클릭

### 4. **메시지 테스트**
1. **토픽 입력** (예: `device/data`)
2. **JSON 메시지** 작성
3. **발행** 버튼으로 전송

## 🛠️ 개발자용 설정

### **요구사항**
- **Node.js** 18+ 
- **npm** 또는 **yarn**
- **macOS** (현재 빌드 지원)

### **설치 및 실행**
```bash
# 저장소 클론
git clone https://github.com/masterplexDev/aws-iot-electron-client.git
cd aws-iot-electron-client

# 의존성 설치
npm install

# 개발 모드 실행
npm run dev

# 프로덕션 빌드
npm run build
```

### **기술 스택**
- **Frontend**: React 18 + TypeScript + Vite
- **Desktop**: Electron 20+
- **UI**: shadcn/ui + Tailwind CSS
- **AWS SDK**: aws-iot-device-sdk-v2
- **Build**: electron-builder

## 📖 문서

| 문서 | 설명 |
|------|------|
| **[빌드 가이드](docs/BUILD_GUIDE.md)** | 개발자용 상세 빌드 가이드 |
| **[사용자 가이드](docs/사용자_실행_안내서.md)** | 최종 사용자용 실행 가이드 |
| **[보안 가이드](docs/SECURITY_NOTICE.md)** | 인증서 보안 관리 방법 |
| **[macOS 보안 해결](docs/MACOS_SECURITY_SOLUTION.md)** | macOS 보안 경고 해결 방법 |
| **[배포 가이드](docs/GitHub_Release_가이드.md)** | GitHub Release 배포 방법 |

## 🐛 트러블슈팅

### **연결 실패**
- AWS IoT 엔드포인트 URL 확인
- 인증서 파일 경로 및 권한 확인
- AWS IoT 정책(Policy) 설정 확인

### **macOS 보안 경고**
- [macOS 보안 해결 가이드](docs/MACOS_SECURITY_SOLUTION.md) 참조

### **빌드 오류**
- [빌드 가이드](docs/BUILD_GUIDE.md) 참조

## 🤝 기여하기

1. **Fork** 프로젝트
2. **Feature 브랜치** 생성 (`git checkout -b feature/AmazingFeature`)
3. **변경사항 커밋** (`git commit -m 'Add some AmazingFeature'`)
4. **브랜치 푸시** (`git push origin feature/AmazingFeature`)
5. **Pull Request** 생성

## 📄 라이선스

이 프로젝트는 **MIT 라이선스** 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🏷️ 버전 정보

- **현재 버전**: 1.0.0
- **릴리즈 날짜**: 2024.08.01
- **호환성**: macOS 10.15+

## 📞 지원

- **이슈 신고**: [GitHub Issues](https://github.com/masterplexDev/aws-iot-electron-client/issues)
- **기능 요청**: [GitHub Discussions](https://github.com/masterplexDev/aws-iot-electron-client/discussions)

---

**⭐ 이 프로젝트가 유용하셨다면 Star를 눌러주세요!**