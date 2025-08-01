import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Send } from 'lucide-react';
import { TopicSelector } from './TopicSelector';

/**
 * MQTT 메시지 발행을 위한 UI 컴포넌트
 * 
 * 토픽 입력, JSON 페이로드 작성, Retain 플래그 설정 등의 기능을 제공합니다.
 */
interface PublishCardProps {
  topic: string;
  setTopic: (value: string) => void;
  payload: string;
  setPayload: (value: string) => void;
  retainMessage: boolean;
  setRetainMessage: (value: boolean) => void;
  isConnected: boolean;
  onPublish: () => void;
}

export const PublishCard: React.FC<PublishCardProps> = ({
  topic,
  setTopic,
  payload,
  setPayload,
  retainMessage,
  setRetainMessage,
  isConnected,
  onPublish
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Send className="h-5 w-5" />
          <span>토픽 발행</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">토픽 이름</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="sdk/test/js"
            className="font-mono"
          />
          <TopicSelector 
            title="허용된 토픽"
            onTopicSelect={setTopic}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">메시지 보존</Label>
            <p className="text-sm text-muted-foreground">마지막 메시지를 보존합니다</p>
          </div>
          <Switch 
            checked={retainMessage}
            onCheckedChange={setRetainMessage}
          />
        </div>
        <Separator />
        <div className="space-y-2">
          <Label htmlFor="payload">메시지 페이로드 (JSON)</Label>
          <Textarea 
            id="payload"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            placeholder='{"message": "Hello World"}'
            className="font-mono h-32"
          />
        </div>
        <Button 
          onClick={onPublish} 
          disabled={!isConnected}
          className="w-full"
        >
          <Send className="mr-2 h-4 w-4" />
          메시지 발행
        </Button>
      </CardContent>
    </Card>
  );
};