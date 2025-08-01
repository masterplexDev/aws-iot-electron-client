import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Download, X } from 'lucide-react';
import { TopicSelector } from './TopicSelector';

/**
 * MQTT 토픽 구독 관리 UI 컴포넌트
 * 
 * 토픽 구독, 구독 목록 표시, 개별 구독 해제 등의 기능을 제공합니다.
 */
interface SubscribeCardProps {
  subscribeTopic: string;
  setSubscribeTopic: (value: string) => void;
  subscribedTopics: string[];
  isConnected: boolean;
  onSubscribe: () => void;
  onUnsubscribe: (topic: string) => void;
}

export const SubscribeCard: React.FC<SubscribeCardProps> = ({
  subscribeTopic,
  setSubscribeTopic,
  subscribedTopics,
  isConnected,
  onSubscribe,
  onUnsubscribe
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>토픽 구독</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subscribeTopic">구독 토픽</Label>
          <Input
            id="subscribeTopic"
            value={subscribeTopic}
            onChange={(e) => setSubscribeTopic(e.target.value)}
            placeholder="sdk/test/js"
            className="font-mono"
          />
          <TopicSelector 
            title="허용된 구독 토픽"
            onTopicSelect={setSubscribeTopic}
          />
        </div>
        <Button 
          onClick={onSubscribe} 
          disabled={!isConnected}
          className="w-full"
          variant="outline"
        >
          <Download className="mr-2 h-4 w-4" />
          토픽 구독
        </Button>
        
        {subscribedTopics.length > 0 && (
          <div className="space-y-2">
            <Separator />
            <Label className="text-sm font-medium">구독 중인 토픽</Label>
            <div className="space-y-1">
              {subscribedTopics.map((topic) => (
                <div key={topic} className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {topic}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onUnsubscribe(topic)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};