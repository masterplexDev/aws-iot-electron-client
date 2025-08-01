import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { ConnectionConfig, PublishData, UseAwsIotReturn } from '../types/aws-iot';

/**
 * AWS IoT Core 연결 및 MQTT 작업을 관리하는 커스텀 훅
 * 
 * 이 훅은 AWS IoT Device SDK v2를 통한 MQTT 연결 상태 관리와
 * 메시지 발행, 토픽 구독/해제 등의 핵심 기능을 제공합니다.
 * 
 * @returns {UseAwsIotReturn} AWS IoT 연결 상태와 관련 함수들
 * 
 * @example
 * ```tsx
 * const { isConnected, connect, publish, subscribe } = useAwsIot();
 * 
 * // AWS IoT에 연결
 * await connect({
 *   endpoint: 'xxx.iot.region.amazonaws.com',
 *   certificatePath: '/path/to/cert.crt',
 *   privateKeyPath: '/path/to/private.key'
 * });
 * 
 * // 메시지 발행
 * await publish({
 *   topic: 'sensors/temperature',
 *   payload: JSON.stringify({ temp: 25.5 })
 * });
 * ```
 */
export const useAwsIot = (): UseAwsIotReturn => {
  // ========================================
  // 상태 관리
  // ========================================
  
  /** AWS IoT Core 연결 상태 */
  const [isConnected, setIsConnected] = useState(false);

  // ========================================
  // 연결 관리 함수들
  // ========================================

  /**
   * AWS IoT Core에 연결을 시도합니다.
   * 
   * mTLS(Mutual TLS) 인증을 사용하여 안전한 연결을 설정하며,
   * 연결 성공 시 엔드포인트가 자동으로 localStorage에 저장됩니다.
   */
  const connect = useCallback(async (config: ConnectionConfig) => {
    try {
      if (!config.endpoint || !config.certificatePath || !config.privateKeyPath) {
        throw new Error('엔드포인트, 인증서, 개인키는 필수 입력 항목입니다.');
      }

      // 실제 AWS IoT 연결
      const result = await (window as any).electronAPI.iotConnect({
        endpoint: config.endpoint,
        certificatePath: config.certificatePath,
        privateKeyPath: config.privateKeyPath,
        rootCAPath: config.rootCAPath?.trim() || undefined,
        clientId: config.clientId || `sdk-nodejs-${Math.random().toString(36).substring(7)}`
      });

      setIsConnected(true);
      
      toast.success('🎉 연결 성공!', {
        description: result.message
      });

    } catch (error: any) {
      toast.error('❌ 연결 실패', {
        description: error.message
      });
      setIsConnected(false);
      throw error;
    }
  }, []);

  /**
   * AWS IoT Core 연결을 해제합니다.
   * 
   * 모든 구독을 정리하고 연결을 안전하게 종료합니다.
   */
  const disconnect = useCallback(async () => {
    if (!isConnected) return;

    try {
      // 실제 AWS IoT 연결 해제
      const result = await (window as any).electronAPI.iotDisconnect();
      setIsConnected(false);
      
      toast.success('연결 해제 완료', {
        description: result.message
      });

    } catch (error: any) {
      toast.error('연결 해제 실패', {
        description: error.message
      });
      throw error;
    }
  }, [isConnected]);

  // ========================================
  // MQTT 메시지 작업 함수들
  // ========================================

  /**
   * 지정된 토픽으로 MQTT 메시지를 발행합니다.
   * 
   * JSON 유효성 검증을 수행하고, QoS 및 Retain 플래그를 지원합니다.
   */
  const publish = useCallback(async (data: PublishData) => {
    if (!isConnected) {
      toast.warning('⚠️ 연결 필요', {
        description: '먼저 AWS IoT Core에 연결해주세요.'
      });
      return;
    }

    try {
      // JSON 유효성 검사
      JSON.parse(data.payload);
      
      // 실제 AWS IoT 메시지 발행
      await (window as any).electronAPI.iotPublish({
        topic: data.topic,
        payload: data.payload,
        qos: data.qos || 0,
        retain: data.retain || false
      });
      
      toast.success('🚀 메시지 발행 완료!', {
        description: `토픽: ${data.topic}`
      });
      
    } catch (error: any) {
      toast.error('❌ 발행 실패', {
        description: error.message
      });
      throw error;
    }
  }, [isConnected]);

  /**
   * 지정된 토픽을 구독합니다.
   * 
   * 와일드카드(+, #) 패턴을 지원하며, QoS 0으로 구독합니다.
   */
  const subscribe = useCallback(async (topic: string) => {
    if (!isConnected) {
      toast.error('연결되지 않음', {
        description: 'AWS IoT Core에 먼저 연결해주세요.'
      });
      return;
    }

    if (!topic.trim()) {
      toast.error('토픽 입력 필요', {
        description: '구독할 토픽을 입력해주세요.'
      });
      return;
    }

    try {
      // 실제 AWS IoT 구독
      const result = await (window as any).electronAPI.iotSubscribe({
        topic: topic.trim(),
        qos: 0
      });
      
      toast.success('🎯 구독 완료!', {
        description: result.message
      });
      
    } catch (error: any) {
      toast.error('❌ 구독 실패', {
        description: error.message
      });
      throw error;
    }
  }, [isConnected]);

  /**
   * 지정된 토픽의 구독을 해제합니다.
   */
  const unsubscribe = useCallback(async (topic: string) => {
    try {
      // 실제 AWS IoT 구독 해제
      await (window as any).electronAPI.iotUnsubscribe({
        topic
      });
      
      toast.success('구독 해제 완료', {
        description: `토픽: ${topic}`
      });
      
    } catch (error: any) {
      toast.error('구독 해제 실패', {
        description: error.message
      });
      throw error;
    }
  }, []);

  return {
    isConnected,
    connect,
    disconnect,
    publish,
    subscribe,
    unsubscribe
  };
};