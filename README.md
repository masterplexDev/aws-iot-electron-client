# 🔌 AWS IoT Core 테스트 클라이언트

AWS IoT Core와 MQTT 통신을 테스트할 수 있는 Electron 데스크톱 애플리케이션입니다.

## ✨ 주요 기능

- 🔐 **mTLS 인증** - AWS IoT Core 인증서 기반 연결
- 📡 **MQTT 메시지 발행/구독** - 실시간 메시지 통신
- 📊 **실시간 모니터링** - 메시지 히스토리 및 상태 표시
- 💾 **설정 자동 저장** - 엔드포인트 및 토픽 설정 저장
- 🎨 **Dark 테마 UI** - shadcn/ui 기반 모던 인터페이스

## 🚀 다운로드

### 최신 릴리즈
[GitHub Releases](https://github.com/YOUR_USERNAME/aws-iot-electron-client/releases)에서 최신 버전을 다운로드하세요.

### 지원 플랫폼
- **macOS** (Apple Silicon + Intel) - DMG 파일 제공

## 📥 설치 및 실행

### macOS
1. **Apple Silicon**: `AWS IoT Core Test Client-1.0.2-arm64.dmg` 다운로드
2. **Intel Mac**: `AWS IoT Core Test Client-1.0.2-x64.dmg` 다운로드
3. DMG 파일을 열고 앱을 **Applications 폴더로 드래그**
4. 마운트된 DMG를 제거 (바탕화면에서 우클릭 → "꺼내기")
5. 첫 실행 시 **우클릭 → "열기"** 선택

## ⚠️ 첫 실행 시 주의사항

### macOS에서 "개발자가 확인되지 않은 앱" 메시지가 나오는 경우
이는 **정상적인 macOS 보안 기능**입니다. 다른 오픈소스 앱들과 동일한 경고입니다.

**해결 방법:**
1. **우클릭 → "열기"** 선택
2. **"열기"** 버튼 클릭
3. 이후부터는 정상적으로 실행됩니다

**또는:**
- **시스템 환경설정 → 보안 및 개인 정보 보호 → 일반**에서 **"확인 없이 열기"** 클릭

## 🔧 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/YOUR_USERNAME/aws-iot-electron-client.git
cd aws-iot-electron-client

# 의존성 설치
npm install

# 개발 모드 실행
npm run dev

# DMG 빌드
npm run dmg
```

## 🛠️ 기술 스택

- **Frontend**: React + TypeScript + Tailwind CSS
- **Desktop**: Electron
- **UI Components**: shadcn/ui
- **MQTT**: AWS IoT Device SDK v2
- **Build**: Vite + electron-builder

## 📋 사용법

1. **AWS IoT Core 엔드포인트 입력**
2. **인증서 파일 선택** (cert, key, ca)
3. **연결 버튼 클릭**
4. **토픽 설정 후 메시지 발행/구독**

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 지원

문제가 있으시면 [GitHub Issues](https://github.com/YOUR_USERNAME/aws-iot-electron-client/issues)에 문의해주세요.

---

**Made with ❤️ for AWS IoT developers**