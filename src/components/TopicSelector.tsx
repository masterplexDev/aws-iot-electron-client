import React from 'react';
import { ALLOWED_TOPICS } from '../constants/topics';

/**
 * 허용된 토픽 목록을 버튼으로 표시하여 빠른 선택을 제공하는 컴포넌트
 */
interface TopicSelectorProps {
  /** 토픽 선택기 제목 (예: "허용된 토픽", "추천 토픽") */
  title: string;
  /** 토픽 선택 시 호출되는 콜백 함수 */
  onTopicSelect: (topic: string) => void;
}

/**
 * 허용된 MQTT 토픽들을 버튼 형태로 표시하여 사용자가 쉽게 선택할 수 있도록 하는 컴포넌트
 * 
 * AWS IoT 정책에서 허용된 토픽들만 표시하며, 클릭 시 해당 토픽이 자동으로 입력됩니다.
 */
export const TopicSelector: React.FC<TopicSelectorProps> = ({ title, onTopicSelect }) => {
  return (
    <div className="text-xs text-muted-foreground">
      <p className="mb-1">💡 {title}:</p>
      <div className="flex flex-wrap gap-1">
        {ALLOWED_TOPICS.map((allowedTopic) => (
          <button
            key={allowedTopic}
            onClick={() => onTopicSelect(allowedTopic)}
            className="px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded font-mono cursor-pointer transition-colors"
          >
            {allowedTopic}
          </button>
        ))}
      </div>
    </div>
  );
};