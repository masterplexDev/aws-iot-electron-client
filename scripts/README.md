# 🔧 Scripts 폴더

AWS IoT Core 테스트 클라이언트 관련 스크립트들입니다.

## 📁 스크립트 분류

### 🚀 **앱 실행 관련**
| 스크립트 | 용도 | 설명 |
|----------|------|------|
| `start_app.sh` | 앱 시작 | Electron 앱 기본 실행 |
| `start_web.sh` | 웹 실행 | 브라우저에서 개발 모드 실행 |
| `run_aws_iot_client.sh` | 클라이언트 실행 | AWS IoT 클라이언트 전용 실행 |

### 🛠️ **macOS 보안 해결**
| 스크립트 | 용도 | 설명 |
|----------|------|------|
| `fix_macos_quarantine.sh` | 기본 보안 해결 | Quarantine 속성 제거 |
| `bypass_macos_security.sh` | 보안 우회 | macOS 보안 정책 우회 |
| `ultimate_macos_fix.sh` | 최강 해결책 | 모든 보안 문제 종합 해결 |
| `fix_and_run_macos_app.sh` | 수정 후 실행 | 앱 수정 + 자동 실행 |
| `force_run_macos_app.sh` | 강제 실행 | 강제로 앱 실행 시도 |
| `fix_app_for_other_mac.sh` | 다른 Mac용 | 다른 Mac에서 실행 준비 |

### 🔐 **인증서 관리**
| 스크립트 | 용도 | 설명 |
|----------|------|------|
| `create_dev_certificate.sh` | 개발자 인증서 | Self-signed 개발자 인증서 생성 |
| `create_simple_cert.sh` | 간단한 인증서 | 간단한 인증서 생성 |

### 🗑️ **유지보수**
| 스크립트 | 용도 | 설명 |
|----------|------|------|
| `uninstall_app.sh` | 앱 제거 | 앱 완전 제거 및 정리 |

## ⚠️ **중요 주의사항**

### 🔒 **보안 관련**
- **개발자 인증서 스크립트**들은 **개발/테스트 전용**입니다
- **실제 배포용**으로는 **Apple Developer Program** 가입 필요
- **보안 우회 스크립트**는 **본인 Mac에서만** 사용하세요

### 💡 **권장 사용법**

#### **개발자용**
```bash
# 개발 모드 실행
./scripts/start_web.sh

# 빌드된 앱 실행 (보안 문제 시)
./scripts/ultimate_macos_fix.sh
```

#### **사용자용**
```bash
# 기본 실행 (보안 경고 시)
./scripts/fix_macos_quarantine.sh
```

#### **다른 Mac 배포시**
```bash
# 앱을 다른 Mac으로 복사한 후
./scripts/fix_app_for_other_mac.sh
```

## 🚫 **더 이상 필요 없는 스크립트들**

대부분의 스크립트들은 **개발 과정에서 생성된 임시 해결책**들입니다.

### **최종 사용자는 다음만 필요:**
- `fix_macos_quarantine.sh` - 기본 보안 해결
- `ultimate_macos_fix.sh` - 최강 해결책

### **개발자는 다음만 필요:**
- `start_web.sh` - 개발 모드
- `ultimate_macos_fix.sh` - 빌드 테스트

**나머지는 삭제해도 됩니다!**

## 🧹 **정리 방법**

```bash
# 필요한 것만 남기고 삭제
rm bypass_macos_security.sh
rm create_dev_certificate.sh  
rm create_simple_cert.sh
rm fix_and_run_macos_app.sh
rm fix_app_for_other_mac.sh
rm force_run_macos_app.sh
rm run_aws_iot_client.sh
rm start_app.sh
rm uninstall_app.sh

# 최종 남길 것들
# - fix_macos_quarantine.sh (기본 해결)
# - ultimate_macos_fix.sh (최강 해결)  
# - start_web.sh (개발 모드)
```

---

**💡 팁**: 대부분의 스크립트는 macOS 보안 문제를 해결하기 위한 **임시방편**이었습니다. 실제 배포에서는 **GitHub Release + 사용자 안내서**로 충분합니다!