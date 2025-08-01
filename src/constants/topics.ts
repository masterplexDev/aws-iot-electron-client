/**
 * AWS IoT Core 애플리케이션의 상수 정의
 * 
 * 이 파일은 MQTT 토픽, QoS 레벨, 기본 페이로드 등
 * 애플리케이션 전반에서 사용되는 상수들을 정의합니다.
 */

// ========================================
// 허용된 MQTT 토픽 목록
// ========================================

/**
 * AWS IoT 정책에서 허용된 MQTT 토픽 목록
 * 
 * 이 토픽들은 AWS IAM 정책에서 Publish, Subscribe 권한이 부여된 토픽들입니다.
 * 새로운 토픽을 추가하려면 AWS IoT 정책도 함께 업데이트해야 합니다.
 */
export const ALLOWED_TOPICS = [
  'sdk/test/js',      // JavaScript/Node.js SDK 테스트용
  'sdk/test/python',  // Python SDK 테스트용
  'sdk/test/java'     // Java SDK 테스트용
] as const;

// ========================================
// 기본값 설정
// ========================================

/** 메시지 발행 시 기본 토픽 */
export const DEFAULT_TOPIC = 'sdk/test/js';

/** 토픽 구독 시 기본 토픽 */
export const DEFAULT_SUBSCRIBE_TOPIC = 'sdk/test/js';

/**
 * 메시지 발행 시 기본 JSON 페이로드
 * 
 * IoT 센서 데이터를 시뮬레이션하는 구조로 구성되어 있으며,
 * 사용자가 수정 가능한 템플릿 역할을 합니다.
 */
export const DEFAULT_PAYLOAD = {
  message: "Hello from AWS IoT Core",
  clientId: "sdk-nodejs-client",
  timestamp: new Date().toISOString(),
  data: {
    temperature: 24.5,    // 온도 센서 데이터 (°C)
    humidity: 65.2,       // 습도 센서 데이터 (%)
    status: "active"      // 디바이스 상태
  }
};

// ========================================
// MQTT 설정 상수
// ========================================

/**
 * MQTT QoS(Quality of Service) 레벨 정의
 * 
 * - AT_MOST_ONCE(0): 최대 한 번 전송 (빠르지만 손실 가능)
 * - AT_LEAST_ONCE(1): 최소 한 번 전송 (중복 가능하지만 보장)
 * - EXACTLY_ONCE(2): 정확히 한 번 전송 (가장 안전하지만 느림)
 */
export const QOS_LEVELS = {
  AT_MOST_ONCE: 0,
  AT_LEAST_ONCE: 1,
  EXACTLY_ONCE: 2
} as const;

/**
 * 토픽별 최대 메시지 보관 개수
 * 
 * 메모리 사용량을 제한하기 위해 토픽당 최신 메시지만 보관합니다.
 * 이 개수를 초과하면 오래된 메시지부터 자동으로 삭제됩니다.
 */
export const MAX_MESSAGES_PER_TOPIC = 100;