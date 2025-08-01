declare global {
  interface Window {
    electronAPI: {
      readFile: (filePath: string) => Promise<string>;
      showOpenDialog: (options: any) => Promise<{ canceled: boolean; filePaths: string[] }>;
      
      // AWS IoT 연결 관련
      iotConnect: (config: {
        endpoint: string;
        certificatePath: string;
        privateKeyPath: string;
        rootCAPath?: string;
        clientId?: string;
      }) => Promise<{ success: boolean; message: string }>;
      iotDisconnect: () => Promise<{ success: boolean; message: string }>;
      iotPublish: (data: {
        topic: string;
        payload: string;
        qos?: number;
        retain?: boolean;
      }) => Promise<{ success: boolean; message: string }>;
      iotSubscribe: (data: {
        topic: string;
        qos?: number;
      }) => Promise<{ success: boolean; message: string }>;
      iotUnsubscribe: (data: {
        topic: string;
      }) => Promise<{ success: boolean; message: string }>;
      
      // 메시지 수신 리스너
      onMessageReceived: (callback: (data: {
        topic: string;
        message: string;
        timestamp: string;
      }) => void) => void;
      removeMessageListener: () => void;
    };
  }
}