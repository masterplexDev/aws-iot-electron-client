import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Shield, Send } from 'lucide-react';
import { toast } from 'sonner';

// 커스텀 훅
import { useAwsIot } from './hooks/useAwsIot';
import { useMessages } from './hooks/useMessages';

// 컴포넌트
import { ConnectionCard } from './components/ConnectionCard';
import { PublishCard } from './components/PublishCard';
import { SubscribeCard } from './components/SubscribeCard';
import { MessageTabs } from './components/MessageTabs';

// 상수 및 타입
import { DEFAULT_TOPIC, DEFAULT_SUBSCRIBE_TOPIC, DEFAULT_PAYLOAD } from './constants/topics';

function App() {
  // 로컬 상태
  const [endpoint, setEndpoint] = useState('');
  const [certificatePath, setCertificatePath] = useState('');
  const [privateKeyPath, setPrivateKeyPath] = useState('');
  const [rootCAPath, setRootCAPath] = useState('');
  const [topic, setTopic] = useState(DEFAULT_TOPIC);
  const [payload, setPayload] = useState(JSON.stringify(DEFAULT_PAYLOAD, null, 2));
  const [subscribeTopic, setSubscribeTopic] = useState(DEFAULT_SUBSCRIBE_TOPIC);
  const [autoReconnect, setAutoReconnect] = useState(true);
  const [retainMessage, setRetainMessage] = useState(false);
  const [hasSavedEndpoint, setHasSavedEndpoint] = useState(false);

  // 커스텀 훅
  const { isConnected, connect, disconnect, publish, subscribe, unsubscribe } = useAwsIot();
  const { 
    subscribedTopics, 
    topicMessages, 
    activeMessageTab, 
    setActiveMessageTab,
    addSubscription,
    removeSubscription,
    clearMessages,
    clearAllMessages,
    clearAllSubscriptions
  } = useMessages();

  // 다크 모드 강제 적용
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // 저장된 엔드포인트 불러오기
  useEffect(() => {
    const savedEndpoint = localStorage.getItem('aws-iot-endpoint');
    if (savedEndpoint) {
      setEndpoint(savedEndpoint);
      setHasSavedEndpoint(true);
    }
  }, []);

  // 엔드포인트 저장 함수
  const saveEndpoint = (endpointValue: string) => {
    if (endpointValue.trim()) {
      localStorage.setItem('aws-iot-endpoint', endpointValue.trim());
      setHasSavedEndpoint(true);
    }
  };

  // 저장된 엔드포인트 삭제 함수
  const clearSavedEndpoint = () => {
    localStorage.removeItem('aws-iot-endpoint');
    setHasSavedEndpoint(false);
    toast.success('저장된 엔드포인트 삭제', {
      description: '저장된 엔드포인트가 삭제되었습니다.'
    });
  };

  // 파일 선택 함수
  const handleFileSelect = async (fileType: 'certificate' | 'privateKey' | 'rootCA') => {
    try {
      const filters = [];
      const title = fileType === 'certificate' ? '디바이스 인증서 파일 선택' :
                    fileType === 'privateKey' ? '개인키 파일 선택' :
                    '루트 CA 파일 선택';

      if (fileType === 'certificate') {
        filters.push({ name: '인증서 파일', extensions: ['crt', 'pem', 'cer'] });
      } else if (fileType === 'privateKey') {
        filters.push({ name: '개인키 파일', extensions: ['key', 'pem'] });
      } else {
        filters.push({ name: 'CA 파일', extensions: ['pem', 'cer', 'crt'] });
      }
      
      filters.push({ name: '모든 파일', extensions: ['*'] });

      const result = await (window as any).electronAPI.showOpenDialog({
        title,
        filters,
        properties: ['openFile']
      });

      if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || filePath;
        
        switch (fileType) {
          case 'certificate':
            setCertificatePath(filePath);
            break;
          case 'privateKey':
            setPrivateKeyPath(filePath);
            break;
          case 'rootCA':
            setRootCAPath(filePath);
            break;
        }
        
        toast.success('파일 선택 완료', {
          description: `${fileName} 파일이 선택되었습니다.`
        });
      }
    } catch (error: any) {
      toast.error('파일 선택 실패', {
        description: error.message
      });
    }
  };

  // 연결 처리
  const handleConnect = async () => {
    try {
      await connect({
        endpoint,
        certificatePath,
        privateKeyPath,
        rootCAPath: rootCAPath.trim() || undefined,
        clientId: `sdk-nodejs-${Math.random().toString(36).substring(7)}`
      });
      
      // 연결 성공 시 엔드포인트 저장
      saveEndpoint(endpoint);
    } catch (error) {
      // 에러는 훅에서 처리됨
    }
  };

  // 연결 해제 처리
  const handleDisconnect = async () => {
    try {
      await disconnect();
      // 모든 구독 정리
      clearAllSubscriptions();
    } catch (error) {
      // 에러는 훅에서 처리됨
    }
  };

  // 메시지 발행 처리
  const handlePublish = async () => {
    try {
      await publish({
        topic,
        payload,
        retain: retainMessage
      });
    } catch (error) {
      // 에러는 훅에서 처리됨
    }
  };

  // 구독 처리
  const handleSubscribe = async () => {
    try {
      await subscribe(subscribeTopic);
      addSubscription(subscribeTopic);
    } catch (error) {
      // 에러는 훅에서 처리됨
    }
  };

  // 구독 해제 처리
  const handleUnsubscribe = async (topicToRemove: string) => {
    try {
      await unsubscribe(topicToRemove);
      removeSubscription(topicToRemove);
    } catch (error) {
      // 에러는 훅에서 처리됨
    }
  };

  return (
    <div className="dark">
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight">AWS IoT Core 테스트 클라이언트</h1>
                    <p className="text-sm text-muted-foreground">실시간 MQTT 메시지 발행 및 구독</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {isConnected ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">연결됨</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">연결 안됨</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto p-6 max-w-7xl min-h-[600px]">
          <Tabs defaultValue="connection" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="connection" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>연결 설정</span>
              </TabsTrigger>
              <TabsTrigger value="messaging" className="flex items-center space-x-2">
                <Send className="h-4 w-4" />
                <span>메시지 & 로그</span>
              </TabsTrigger>
            </TabsList>

            {/* 연결 설정 탭 */}
            <TabsContent value="connection" className="space-y-6">
              <ConnectionCard
                isConnected={isConnected}
                endpoint={endpoint}
                setEndpoint={setEndpoint}
                certificatePath={certificatePath}
                setCertificatePath={setCertificatePath}
                privateKeyPath={privateKeyPath}
                setPrivateKeyPath={setPrivateKeyPath}
                rootCAPath={rootCAPath}
                setRootCAPath={setRootCAPath}
                autoReconnect={autoReconnect}
                setAutoReconnect={setAutoReconnect}
                hasSavedEndpoint={hasSavedEndpoint}
                clearSavedEndpoint={clearSavedEndpoint}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onFileSelect={handleFileSelect}
              />
            </TabsContent>

            {/* 메시지 & 로그 탭 */}
            <TabsContent value="messaging" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-4">
                <PublishCard
                  topic={topic}
                  setTopic={setTopic}
                  payload={payload}
                  setPayload={setPayload}
                  retainMessage={retainMessage}
                  setRetainMessage={setRetainMessage}
                  isConnected={isConnected}
                  onPublish={handlePublish}
                />

                <SubscribeCard
                  subscribeTopic={subscribeTopic}
                  setSubscribeTopic={setSubscribeTopic}
                  subscribedTopics={subscribedTopics}
                  isConnected={isConnected}
                  onSubscribe={handleSubscribe}
                  onUnsubscribe={handleUnsubscribe}
                />
              </div>

              <MessageTabs
                subscribedTopics={subscribedTopics}
                topicMessages={topicMessages}
                activeMessageTab={activeMessageTab}
                setActiveMessageTab={setActiveMessageTab}
                clearMessages={clearMessages}
                clearAllMessages={clearAllMessages}
                onUnsubscribe={handleUnsubscribe}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

export default App;