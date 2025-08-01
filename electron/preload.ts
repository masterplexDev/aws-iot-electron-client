/**
 * Electron 프리로드 스크립트
 * 
 * 렌더러 프로세스와 메인 프로세스 간의 안전한 IPC 통신을 위한
 * contextBridge API 노출을 담당합니다.
 * 
 * 보안을 위해 필요한 API만 선택적으로 노출하며,
 * Node.js API에 직접 접근하지 못하도록 격리합니다.
 */

import { contextBridge, ipcRenderer } from 'electron';

/**
 * 렌더러 프로세스에서 사용할 수 있는 Electron API 노출
 */
contextBridge.exposeInMainWorld('electronAPI', {
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  showOpenDialog: (options: any) => ipcRenderer.invoke('show-open-dialog', options),
  
  // AWS IoT 연결 관련
  iotConnect: (config: any) => ipcRenderer.invoke('iot-connect', config),
  iotDisconnect: () => ipcRenderer.invoke('iot-disconnect'),
  iotPublish: (data: any) => ipcRenderer.invoke('iot-publish', data),
  iotSubscribe: (data: any) => ipcRenderer.invoke('iot-subscribe', data),
  iotUnsubscribe: (data: any) => ipcRenderer.invoke('iot-unsubscribe', data),
  
  // 메시지 수신 리스너
  onMessageReceived: (callback: (data: any) => void) => {
    // 기존 리스너들 제거
    ipcRenderer.removeAllListeners('message-received');
    // 새 리스너 등록
    ipcRenderer.on('message-received', (event, data) => callback(data));
  },
  
  // 리스너 제거
  removeMessageListener: () => {
    ipcRenderer.removeAllListeners('message-received');
  }
});