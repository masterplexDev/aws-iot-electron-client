import { useState, useEffect, useCallback } from 'react';
import type { TopicMessages, UseMessagesReturn } from '../types/aws-iot';
import { MAX_MESSAGES_PER_TOPIC } from '../constants/topics';

/**
 * MQTT 메시지 수신 및 구독 토픽 관리를 위한 커스텀 훅
 * 
 * 이 훅은 구독된 토픽 목록, 수신된 메시지 저장, 메시지 탭 관리 등
 * 메시지 관련 모든 상태와 기능을 제공합니다.
 * 
 * @returns {UseMessagesReturn} 메시지 관리 상태와 관련 함수들
 * 
 * @example
 * ```tsx
 * const { 
 *   subscribedTopics, 
 *   topicMessages, 
 *   addSubscription,
 *   clearMessages 
 * } = useMessages();
 * 
 * // 구독 목록에 토픽 추가
 * addSubscription('sensors/temperature');
 * 
 * // 특정 토픽의 메시지 삭제
 * clearMessages('sensors/temperature');
 * ```
 */
export const useMessages = (): UseMessagesReturn => {
  // ========================================
  // 상태 관리
  // ========================================
  
  /** 현재 구독 중인 토픽 목록 */
  const [subscribedTopics, setSubscribedTopics] = useState<string[]>([]);
  
  /** 토픽별로 그룹화된 수신 메시지 저장소 */
  const [topicMessages, setTopicMessages] = useState<TopicMessages>({});
  
  /** 현재 활성화된 메시지 탭 (토픽 이름) */
  const [activeMessageTab, setActiveMessageTab] = useState<string | null>(null);

  // ========================================
  // 메시지 수신 처리
  // ========================================

  /**
   * Electron 메인 프로세스로부터 MQTT 메시지 수신 리스너를 설정합니다.
   * 
   * 와일드카드 토픽 매칭을 지원하며, 수신된 메시지를 적절한 토픽에 저장합니다.
   */
  useEffect(() => {
    (window as any).electronAPI.onMessageReceived((data: any) => {
      const { topic, message } = data;
      
      // 현재 구독 중인 토픽들과 매칭 확인
      setTopicMessages(prev => {
        // 현재 구독된 토픽들
        const currentTopics = Object.keys(prev);
        
        const matchedTopic = currentTopics.find(subscribedTopic => 
          subscribedTopic === topic || 
          (subscribedTopic.includes('+') && new RegExp(subscribedTopic.replace('+', '[^/]+') + '$').test(topic))
        );
        
        if (matchedTopic) {
          return {
            ...prev,
            [matchedTopic]: [{
              topic,
              message,
              timestamp: new Date().toLocaleTimeString('ko-KR')
            }, ...(prev[matchedTopic] || []).slice(0, MAX_MESSAGES_PER_TOPIC - 1)]
          };
        }
        
        return prev;
      });
    });

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      (window as any).electronAPI.removeMessageListener();
    };
  }, []);

  // ========================================
  // 구독 관리 함수들
  // ========================================

  /**
   * 새로운 토픽을 구독 목록에 추가하고 메시지 저장소를 초기화합니다.
   */
  const addSubscription = useCallback((topic: string) => {
    setSubscribedTopics(prev => [...prev, topic]);
    
    // 새 토픽을 위한 메시지 저장소 초기화
    setTopicMessages(prev => ({
      ...prev,
      [topic]: []
    }));
    
    // 새로 구독한 토픽을 활성 탭으로 설정
    setActiveMessageTab(topic);
  }, []);

  /**
   * 토픽을 구독 목록에서 제거하고 관련 메시지를 삭제합니다.
   */
  const removeSubscription = useCallback((topicToRemove: string) => {
    setSubscribedTopics(prev => prev.filter(t => t !== topicToRemove));
    
    // 토픽별 메시지 저장소에서 제거
    setTopicMessages(prev => {
      const newMessages = { ...prev };
      delete newMessages[topicToRemove];
      return newMessages;
    });
    
    // 활성 탭이 제거되는 토픽이라면 다른 탭으로 변경
    setActiveMessageTab(prev => {
      if (prev === topicToRemove) {
        const remainingTopics = subscribedTopics.filter(t => t !== topicToRemove);
        return remainingTopics.length > 0 ? remainingTopics[0] : null;
      }
      return prev;
    });
  }, [subscribedTopics]);

  // ========================================
  // 메시지 관리 함수들
  // ========================================

  /**
   * 특정 토픽의 메시지를 모두 삭제합니다.
   */
  const clearMessages = useCallback((topic?: string) => {
    if (topic) {
      setTopicMessages(prev => ({
        ...prev,
        [topic]: []
      }));
    }
  }, []);

  /**
   * 모든 토픽의 메시지를 삭제합니다.
   */
  const clearAllMessages = useCallback(() => {
    setTopicMessages({});
  }, []);

  /**
   * 모든 구독과 메시지를 정리합니다. (주로 연결 해제 시 사용)
   */
  const clearAllSubscriptions = useCallback(() => {
    setSubscribedTopics([]);
    setTopicMessages({});
    setActiveMessageTab(null);
  }, []);

  return {
    subscribedTopics,
    topicMessages,
    activeMessageTab,
    setActiveMessageTab,
    addSubscription,
    removeSubscription,
    clearMessages,
    clearAllMessages,
    clearAllSubscriptions
  };
};