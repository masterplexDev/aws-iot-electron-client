/**
 * AWS IoT Core 테스트 클라이언트 - Electron 메인 프로세스
 * 
 * 이 파일은 Electron 애플리케이션의 메인 프로세스를 담당하며,
 * 다음과 같은 핵심 기능을 제공합니다:
 * 
 * 1. 브라우저 윈도우 생성 및 관리
 * 2. AWS IoT Device SDK v2를 통한 실제 MQTT 연결 관리
 * 3. 파일 시스템 접근 (인증서 파일 읽기, 파일 다이얼로그)
 * 4. IPC 통신을 통한 렌더러 프로세스와의 데이터 교환
 * 5. 보안 정책 설정 (CSP, webSecurity)
 * 
 * @author AWS IoT Client
 * @version 1.0.0
 */

import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { mqtt, io, iot } from 'aws-iot-device-sdk-v2';

// ========================================
// 전역 변수 - AWS IoT 연결 관리
// ========================================

/** 현재 활성 MQTT 연결 객체 */
let connection: mqtt.MqttClientConnection | null = null;

/** MQTT 클라이언트 객체 */
let client: mqtt.MqttClient | null = null;

// ========================================
// Electron 윈도우 관리
// ========================================

/**
 * 메인 브라우저 윈도우를 생성하고 설정합니다.
 * 
 * 보안 설정:
 * - nodeIntegration: false (보안 강화)
 * - contextIsolation: true (컨텍스트 격리)
 * - enableRemoteModule: false (원격 모듈 비활성화)
 * - webSecurity: false (개발 환경에서 CORS 해결)
 * 
 * CSP 설정으로 XSS 공격 방지 및 외부 리소스 로딩 제한
 */
function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    resizable: true,
    maximizable: true,
    fullscreenable: true,
    show: true, // 즉시 창 표시
    title: 'AWS IoT Core 테스트 클라이언트',
    icon: path.join(__dirname, '../assets/icon.png'), // 아이콘이 있다면
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // V8 안정성을 위해 완전 비활성화
      contextIsolation: true, // contextBridge 사용을 위해 활성화
      webSecurity: true, // 웹 보안 활성화
      allowRunningInsecureContent: false, // 보안 콘텐츠만 허용
      experimentalFeatures: false, // 실험적 기능 비활성화
      nodeIntegrationInWorker: false, // 워커에서 Node.js 비활성화
      nodeIntegrationInSubFrames: false, // 서브프레임에서 Node.js 비활성화
      sandbox: false, // 렌더링 문제 해결을 위해 일시 비활성화

      backgroundThrottling: false, // 백그라운드 스로틀링 비활성화
      offscreen: false, // 오프스크린 렌더링 비활성화
    },
  });

  // 창이 준비되면 표시 (깜빡임 방지)
  win.once('ready-to-show', () => {
    win.show();
    win.focus(); // 창을 전면으로 가져오기
    
    // 개발 환경에서만 최대화
    if (process.env.VITE_DEV_SERVER_URL) {
      win.maximize();
    }
  });

  // 추가: 강제 창 표시 (빌드 버전 호환성)
  const forceShowTimer = setTimeout(() => {
    if (!win.isDestroyed() && !win.isVisible()) {
      win.show();
      win.focus();
      console.log('강제로 창을 표시했습니다');
    }
  }, 2000); // 2초 후 창이 보이지 않으면 강제 표시

  // 창이 닫힐 때 타이머 정리
  win.on('closed', () => {
    if (forceShowTimer) {
      clearTimeout(forceShowTimer);
    }
  });

  // 개발 환경에서 개발자 도구 자동 열기
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    // 빌드된 앱에서 올바른 경로 사용
    // ASAR 내부: dist/electron/main.js -> dist/index.html
    const indexPath = path.join(__dirname, '..', 'index.html');
    win.loadFile(indexPath);
  }
}

app.whenReady().then(() => {
  createWindow();

  // ========================================
  // IPC 핸들러 - 파일 시스템 접근
  // ========================================

  /**
   * 네이티브 파일 선택 다이얼로그 표시
   * 
   * 렌더러 프로세스에서 로컬 파일을 선택할 수 있도록
   * Electron의 dialog.showOpenDialog API를 노출합니다.
   * 
   * @param options - 파일 다이얼로그 설정 옵션
   * @returns 선택된 파일 정보
   */
  ipcMain.handle('show-open-dialog', async (event, options) => {
    try {
      const result = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow()!, options);
      return result;
    } catch (error: any) {
      console.error('파일 대화상자 오류:', error.message);
      throw error;
    }
  });

  /**
   * 로컬 파일 내용 읽기
   * 
   * 렌더러 프로세스에서 로컬 파일 시스템에 접근할 수 있도록
   * Node.js fs 모듈을 통한 파일 읽기 기능을 제공합니다.
   * 
   * 보안을 위해 파일 존재 여부를 확인하고 절대 경로로 변환합니다.
   * 
   * @param filePath - 읽을 파일의 경로 (상대/절대 경로 모두 지원)
   * @returns 파일 내용 (UTF-8 텍스트)
   */
  ipcMain.handle('read-file', async (event, filePath) => {
    try {
      // 절대 경로로 변환
      const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
      
      // 파일 존재 확인
      if (!fs.existsSync(absolutePath)) {
        throw new Error(`파일을 찾을 수 없습니다: ${absolutePath}`);
      }
      
      const data = fs.readFileSync(absolutePath, 'utf8');
      console.log(`파일 읽기 성공: ${absolutePath}`);
      return data;
    } catch (error: any) {
      console.error(`파일 읽기 실패 ${filePath}: ${error.message}`);
      throw new Error(`파일 읽기 실패: ${error.message}`);
    }
  });

  // ========================================
  // IPC 핸들러 - AWS IoT Core 연결 관리
  // ========================================

  /**
   * AWS IoT Core 연결 설정 및 mTLS 인증
   * 
   * AWS IoT Device SDK v2를 사용하여 MQTT over TLS 연결을 설정합니다.
   * 클라이언트 인증서와 개인키를 통한 mTLS(Mutual TLS) 인증을 수행하며,
   * 루트 CA는 선택사항으로 AWS 기본 CA를 사용할 수 있습니다.
   * 
   * @param config - 연결 설정 (endpoint, certificatePath, privateKeyPath, etc.)
   * @returns 연결 결과 객체
   */
  ipcMain.handle('iot-connect', async (event, config) => {
    try {
      console.log('AWS IoT 연결 시도:', config.endpoint);

      // 기존 연결이 있으면 해제
      if (connection) {
        await connection.disconnect();
        connection = null;
        client = null;
      }

      // 클라이언트 Bootstrap 생성  
      const clientBootstrap = new io.ClientBootstrap();

      // MQTT 클라이언트 생성
      client = new mqtt.MqttClient(clientBootstrap);
      
      // 연결 설정 생성
      const connectionConfig = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(
        config.certificatePath,
        config.privateKeyPath
      );

      // 엔드포인트 설정
      connectionConfig.with_endpoint(config.endpoint);
      
      // 포트 설정 (기본 8883)
      connectionConfig.with_port(8883);
      
      // 클라이언트 ID 설정
      connectionConfig.with_client_id(config.clientId || `sdk-nodejs-${Math.random().toString(36).substring(7)}`);
      
      // 클린 세션 설정
      connectionConfig.with_clean_session(false);
      
      // Root CA 설정 (선택사항)
      if (config.rootCAPath) {
        connectionConfig.with_certificate_authority_from_path(undefined, config.rootCAPath);
      }

      // 연결 생성
      connection = client.new_connection(connectionConfig.build());

      // 연결 이벤트 리스너
      connection.on('connect', () => {
        console.log('AWS IoT 연결 성공');
      });

      connection.on('interrupt', (error) => {
        console.log('AWS IoT 연결 중단:', error);
      });

      connection.on('resume', () => {
        console.log('AWS IoT 연결 재개');
      });

      connection.on('disconnect', () => {
        console.log('AWS IoT 연결 해제');
      });

      connection.on('error', (error) => {
        console.error('AWS IoT 연결 오류:', error);
      });

      // 연결 실행
      await connection.connect();
      console.log('AWS IoT Core 연결 완료');
      
      return { success: true, message: 'AWS IoT Core에 성공적으로 연결되었습니다.' };

    } catch (error: any) {
      console.error('AWS IoT 연결 실패:', error.message);
      connection = null;
      client = null;
      throw new Error(`연결 실패: ${error.message}`);
    }
  });

  /**
   * AWS IoT Core 연결 해제
   */
  ipcMain.handle('iot-disconnect', async () => {
    try {
      if (connection) {
        await connection.disconnect();
        connection = null;
        client = null;
        console.log('AWS IoT 연결 해제 완료');
        return { success: true, message: '연결이 해제되었습니다.' };
      }
      return { success: true, message: '이미 연결이 해제되어 있습니다.' };
    } catch (error: any) {
      console.error('연결 해제 실패:', error.message);
      throw new Error(`연결 해제 실패: ${error.message}`);
    }
  });

  /**
   * MQTT 메시지 발행
   * 지정된 토픽으로 JSON 페이로드를 발행합니다.
   */
  ipcMain.handle('iot-publish', async (event, { topic, payload, qos = 0, retain = false }) => {
    try {
      if (!connection) {
        throw new Error('AWS IoT에 연결되지 않았습니다.');
      }

      await connection.publish(topic, payload, qos, retain);
      console.log(`메시지 발행 성공 - 토픽: ${topic}`);
      
      return { success: true, message: '메시지가 성공적으로 발행되었습니다.' };
    } catch (error: any) {
      console.error('메시지 발행 실패:', error.message);
      throw new Error(`발행 실패: ${error.message}`);
    }
  });

  /**
   * MQTT 토픽 구독
   * 지정된 토픽을 구독하고 메시지 수신 콜백을 설정합니다.
   */
  ipcMain.handle('iot-subscribe', async (event, { topic, qos = 0 }) => {
    try {
      if (!connection) {
        throw new Error('AWS IoT에 연결되지 않았습니다.');
      }

      await connection.subscribe(
        topic,
        qos,
        (topic, payload, dup, qos, retain) => {
          // 메시지 수신 시 렌더러 프로세스로 전달
          const message = new TextDecoder('utf8').decode(payload);
          const mainWindow = BrowserWindow.getAllWindows()[0];
          if (mainWindow) {
            mainWindow.webContents.send('message-received', {
              topic,
              message,
              timestamp: new Date().toISOString()
            });
          }
        }
      );

      console.log(`토픽 구독 성공: ${topic}`);
      return { success: true, message: `토픽 ${topic} 구독이 완료되었습니다.` };
    } catch (error: any) {
      console.error('토픽 구독 실패:', error.message);
      throw new Error(`구독 실패: ${error.message}`);
    }
  });

  /**
   * MQTT 토픽 구독 해제
   */
  ipcMain.handle('iot-unsubscribe', async (event, { topic }) => {
    try {
      if (!connection) {
        throw new Error('AWS IoT에 연결되지 않았습니다.');
      }

      await connection.unsubscribe(topic);
      console.log(`토픽 구독 해제 성공: ${topic}`);
      
      return { success: true, message: `토픽 ${topic} 구독이 해제되었습니다.` };
    } catch (error: any) {
      console.error('토픽 구독 해제 실패:', error.message);
      throw new Error(`구독 해제 실패: ${error.message}`);
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 앱 종료 시 정리
app.on('before-quit', async () => {
  try {
    if (connection) {
      await connection.disconnect();
      connection = null;
      client = null;
      console.log('앱 종료 시 AWS IoT 연결 해제 완료');
    }
  } catch (error) {
    console.error('앱 종료 시 연결 해제 실패:', error);
  }
});