/**
 * AWS IoT Core 클라이언트 애플리케이션의 타입 정의
 * 
 * 이 파일은 AWS IoT Device SDK v2를 사용한 MQTT 연결, 메시지 발행/구독,
 * 그리고 React 애플리케이션의 상태 관리를 위한 모든 타입을 정의합니다.
 */

// ========================================
// AWS IoT 연결 및 인증 관련 타입
// ========================================

/**
 * AWS IoT Core 연결에 필요한 설정 정보
 */
export interface ConnectionConfig {
  /** AWS IoT Core 엔드포인트 URL (예: xxx.iot.region.amazonaws.com) */
  endpoint: string;
  /** 디바이스 인증서 파일 경로 (.crt, .pem) */
  certificatePath: string;
  /** 개인키 파일 경로 (.key, .pem) */
  privateKeyPath: string;
  /** 루트 CA 파일 경로 (선택사항, AWS 기본 CA 사용 시 불필요) */
  rootCAPath?: string;
  /** MQTT 클라이언트 ID (선택사항, 자동 생성 가능) */
  clientId?: string;
}

/**
 * AWS IoT 연결/해제 작업의 결과
 */
export interface ConnectionResult {
  /** 작업 성공 여부 */
  success: boolean;
  /** 결과 메시지 (성공/실패 사유) */
  message: string;
}

// ========================================
// MQTT 메시지 관련 타입
// ========================================

/**
 * MQTT 메시지 발행을 위한 데이터
 */
export interface PublishData {
  /** 발행할 토픽 이름 */
  topic: string;
  /** JSON 형태의 메시지 페이로드 */
  payload: string;
  /** QoS 레벨 (0, 1, 2) - 기본값: 0 */
  qos?: number;
  /** 메시지 보존 플래그 - 기본값: false */
  retain?: boolean;
}

/**
 * MQTT 토픽 구독을 위한 데이터
 */
export interface SubscribeData {
  /** 구독할 토픽 이름 (와일드카드 + 지원) */
  topic: string;
  /** QoS 레벨 (0, 1, 2) - 기본값: 0 */
  qos?: number;
}

/**
 * 수신된 MQTT 메시지
 */
export interface Message {
  /** 메시지가 수신된 토픽 */
  topic: string;
  /** 메시지 내용 (JSON 문자열) */
  message: string;
  /** 수신 시각 (한국 시간 형식) */
  timestamp: string;
}

/**
 * 토픽별로 그룹화된 메시지 저장소
 * 키: 구독한 토픽, 값: 해당 토픽의 메시지 배열
 */
export interface TopicMessages {
  [topic: string]: Message[];
}

// ========================================
// React 커스텀 훅 반환 타입
// ========================================

/**
 * useAwsIot 훅의 반환 타입
 * AWS IoT 연결 상태 관리 및 MQTT 작업을 위한 함수들
 */
export interface UseAwsIotReturn {
  /** 현재 AWS IoT 연결 상태 */
  isConnected: boolean;
  /** AWS IoT Core에 연결 */
  connect: (config: ConnectionConfig) => Promise<void>;
  /** AWS IoT Core 연결 해제 */
  disconnect: () => Promise<void>;
  /** MQTT 메시지 발행 */
  publish: (data: PublishData) => Promise<void>;
  /** MQTT 토픽 구독 */
  subscribe: (topic: string) => Promise<void>;
  /** MQTT 토픽 구독 해제 */
  unsubscribe: (topic: string) => Promise<void>;
}

/**
 * useMessages 훅의 반환 타입
 * 구독된 토픽과 수신된 메시지 관리를 위한 상태와 함수들
 */
export interface UseMessagesReturn {
  /** 현재 구독 중인 토픽 목록 */
  subscribedTopics: string[];
  /** 토픽별 수신된 메시지들 */
  topicMessages: TopicMessages;
  /** 현재 활성화된 메시지 탭 */
  activeMessageTab: string | null;
  /** 활성 메시지 탭 변경 */
  setActiveMessageTab: (tab: string | null) => void;
  /** 구독 목록에 토픽 추가 */
  addSubscription: (topic: string) => void;
  /** 구독 목록에서 토픽 제거 */
  removeSubscription: (topic: string) => void;
  /** 특정 토픽의 메시지 삭제 */
  clearMessages: (topic?: string) => void;
  /** 모든 토픽의 메시지 삭제 */
  clearAllMessages: () => void;
  /** 모든 구독 및 메시지 정리 (연결 해제 시 사용) */
  clearAllSubscriptions: () => void;
}