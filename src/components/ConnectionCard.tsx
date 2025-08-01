import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Globe, Wifi, WifiOff, Shield, Save, Trash2, FolderOpen } from 'lucide-react';

/**
 * AWS IoT Core 연결 설정 및 인증서 관리 UI 컴포넌트
 * 
 * 엔드포인트 설정, 인증서 파일 선택, 연결/해제 등의 기능을 제공합니다.
 */
interface ConnectionCardProps {
  // 연결 상태
  isConnected: boolean;
  
  // 폼 데이터
  endpoint: string;
  setEndpoint: (value: string) => void;
  certificatePath: string;
  setCertificatePath: (value: string) => void;
  privateKeyPath: string;
  setPrivateKeyPath: (value: string) => void;
  rootCAPath: string;
  setRootCAPath: (value: string) => void;
  autoReconnect: boolean;
  setAutoReconnect: (value: boolean) => void;
  
  // 저장된 엔드포인트
  hasSavedEndpoint: boolean;
  clearSavedEndpoint: () => void;
  
  // 액션 핸들러
  onConnect: () => void;
  onDisconnect: () => void;
  onFileSelect: (fileType: 'certificate' | 'privateKey' | 'rootCA') => void;
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({
  isConnected,
  endpoint,
  setEndpoint,
  certificatePath,
  setCertificatePath,
  privateKeyPath,
  setPrivateKeyPath,
  rootCAPath,
  setRootCAPath,
  autoReconnect,
  setAutoReconnect,
  hasSavedEndpoint,
  clearSavedEndpoint,
  onConnect,
  onDisconnect,
  onFileSelect
}) => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* AWS IoT 엔드포인트 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>AWS IoT 엔드포인트</span>
              {hasSavedEndpoint && (
                <Save className="h-4 w-4 text-green-500" />
              )}
            </div>
            {hasSavedEndpoint && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSavedEndpoint}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            IoT Core 연결 엔드포인트 설정
            {hasSavedEndpoint && (
              <span className="text-green-600 ml-2">• 저장됨</span>
            )}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="endpoint">
              엔드포인트 URL
              {hasSavedEndpoint && (
                <span className="text-xs text-green-600 ml-2">(자동 저장됨)</span>
              )}
            </Label>
            <Input
              id="endpoint"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="a1b2c3d4e5f6g7.iot.us-east-1.amazonaws.com"
              className="font-mono"
            />
            {hasSavedEndpoint && (
              <p className="text-xs text-muted-foreground">
                💡 연결 성공 시 엔드포인트가 자동으로 저장되어 다음에 자동으로 불러옵니다.
              </p>
            )}
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">자동 재연결</Label>
              <p className="text-sm text-muted-foreground">연결이 끊어지면 자동으로 재연결합니다</p>
            </div>
            <Switch 
              checked={autoReconnect}
              onCheckedChange={setAutoReconnect}
            />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label className="text-sm font-medium">연결 상태</Label>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">연결됨</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">연결 안됨</span>
                </>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={onConnect} 
              disabled={isConnected}
              className="flex-1"
            >
              <Shield className="mr-2 h-4 w-4" />
              연결
            </Button>
            <Button 
              onClick={onDisconnect} 
              disabled={!isConnected}
              variant="outline"
              className="flex-1"
            >
              연결 해제
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 인증서 설정 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>인증서 설정</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">디바이스 인증을 위한 인증서 파일들</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="certificatePath">
              디바이스 인증서 <span className="text-xs text-muted-foreground">(필수)</span>
            </Label>
            <p className="text-xs text-muted-foreground">
              💡 단일 .crt 파일에 인증서와 개인키가 모두 포함된 경우 이 필드만 채우세요
            </p>
            <div className="flex space-x-2">
              <Input
                id="certificatePath"
                value={certificatePath}
                onChange={(e) => setCertificatePath(e.target.value)}
                placeholder="device-certificate.crt"
                className="font-mono"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => onFileSelect('certificate')}
                className="shrink-0"
              >
                <FolderOpen className="h-4 w-4 mr-1" /> 찾기
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="privateKeyPath">
              개인키 <span className="text-xs text-muted-foreground">(선택사항)</span>
            </Label>
            <p className="text-xs text-muted-foreground">
              💡 인증서 파일에 포함되지 않은 경우 별도 입력
            </p>
            <div className="flex space-x-2">
              <Input
                id="privateKeyPath"
                value={privateKeyPath}
                onChange={(e) => setPrivateKeyPath(e.target.value)}
                placeholder="private-key.key"
                className="font-mono"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => onFileSelect('privateKey')}
                className="shrink-0"
              >
                <FolderOpen className="h-4 w-4 mr-1" /> 찾기
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rootCAPath">
              루트 CA <span className="text-xs text-muted-foreground">(선택사항)</span>
            </Label>
            <p className="text-xs text-muted-foreground">
              💡 AWS IoT는 기본 루트 CA 사용. 커스텀 CA 사용 시에만 입력
            </p>
            <div className="flex space-x-2">
              <Input
                id="rootCAPath"
                value={rootCAPath}
                onChange={(e) => setRootCAPath(e.target.value)}
                placeholder="root-CA.pem (선택사항)"
                className="font-mono"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => onFileSelect('rootCA')}
                className="shrink-0"
              >
                <FolderOpen className="h-4 w-4 mr-1" /> 찾기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};