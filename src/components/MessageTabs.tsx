import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Inbox, MessageSquare } from 'lucide-react';
import type { TopicMessages } from '../types/aws-iot';

/**
 * 수신된 MQTT 메시지를 토픽별 탭으로 표시하는 컴포넌트
 * 
 * 토픽별로 탭을 생성하고, 각 탭에서 해당 토픽의 메시지들을 시간순으로 표시합니다.
 * JSON 포맷팅, 메시지 삭제, 구독 해제 등의 기능을 제공합니다.
 */
interface MessageTabsProps {
  subscribedTopics: string[];
  topicMessages: TopicMessages;
  activeMessageTab: string | null;
  setActiveMessageTab: (tab: string | null) => void;
  clearMessages: (topic: string) => void;
  clearAllMessages: () => void;
  onUnsubscribe: (topic: string) => void;
}

export const MessageTabs: React.FC<MessageTabsProps> = ({
  subscribedTopics,
  topicMessages,
  activeMessageTab,
  setActiveMessageTab,
  clearMessages,
  clearAllMessages,
  onUnsubscribe
}) => {
  const totalMessages = Object.values(topicMessages).reduce((total, messages) => total + messages.length, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Inbox className="h-5 w-5" />
            <span>구독 메시지</span>
          </CardTitle>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="font-mono">
              <Inbox className="mr-1 h-3 w-3" />
              {totalMessages}개 수신
            </Badge>
            {Object.keys(topicMessages).length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllMessages}
              >
                전체 지우기
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {subscribedTopics.length > 0 
            ? `구독 중인 토픽: ${subscribedTopics.join(', ')}`
            : '구독된 토픽이 없습니다. 위에서 토픽을 구독해보세요.'
          }
        </p>
      </CardHeader>
      <CardContent>
        {subscribedTopics.length === 0 ? (
          <div className="rounded-lg border bg-muted/30 p-4 h-64 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                토픽을 구독하면 여기에 탭별로 실시간 메시지가 표시됩니다.
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                💡 허용된 토픽: sdk/test/js, sdk/test/python, sdk/test/java
              </p>
            </div>
          </div>
        ) : (
          <Tabs value={activeMessageTab || subscribedTopics[0]} onValueChange={setActiveMessageTab}>
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
              {subscribedTopics.map((topic) => (
                <TabsTrigger key={topic} value={topic} className="text-xs px-2 py-1">
                  <span className="truncate">{topic}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {topicMessages[topic]?.length || 0}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
            {subscribedTopics.map((topic) => (
              <TabsContent key={topic} value={topic} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">토픽: {topic}</h4>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => clearMessages(topic)}
                    >
                      메시지 지우기
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUnsubscribe(topic)}
                    >
                      구독 해제
                    </Button>
                  </div>
                </div>
                <div className="h-64 overflow-y-auto border rounded-lg p-3 bg-muted/20">
                  {topicMessages[topic]?.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm">
                      아직 수신된 메시지가 없습니다.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {topicMessages[topic]?.map((msg, index) => (
                        <div key={index} className="p-2 bg-background rounded border text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-mono text-muted-foreground">{msg.topic}</span>
                            <span className="text-muted-foreground">{msg.timestamp}</span>
                          </div>
                          <pre className="font-mono whitespace-pre-wrap break-words">
                            {typeof msg.message === 'string' ? 
                              (() => {
                                try {
                                  return JSON.stringify(JSON.parse(msg.message), null, 2);
                                } catch {
                                  return msg.message;
                                }
                              })() : 
                              JSON.stringify(msg.message, null, 2)
                            }
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};