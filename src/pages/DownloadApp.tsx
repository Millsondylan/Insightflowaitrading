import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { isCapacitor } from '@/capacitor-plugins';
// In a real app, you would use: import QRCode from 'qrcode.react';

const APP_VERSION = "2.0.0";
const ANDROID_APK_URL = "https://downloads.insightflow.ai/android/InsightFlowAI-v2.0.0.apk";
const MACOS_APP_URL = "https://downloads.insightflow.ai/desktop/InsightFlowAI-v2.0.0.dmg";
const WEB_APP_URL = "https://app.insightflow.ai";

export default function DownloadApp() {
  const { t } = useTranslation('common');
  const [isAlreadyInstalled, setIsAlreadyInstalled] = useState(false);
  
  useEffect(() => {
    // Check if already running in Capacitor
    setIsAlreadyInstalled(isCapacitor());
  }, []);
  
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: t('ui.success'),
      description: t('wallet.copySuccess'),
    });
  };
  
  const downloadAndroid = () => {
    window.location.href = ANDROID_APK_URL;
  };
  
  const downloadMacOS = () => {
    window.location.href = MACOS_APP_URL;
  };
  
  // For PWA installation
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPrompt(e);
    });
  }, []);
  
  const handlePWAInstall = () => {
    if (installPrompt) {
      // Show the prompt
      installPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          toast({
            title: t('ui.success'),
            description: "Installing app...",
          });
        } else {
          console.log('User dismissed the install prompt');
        }
        setInstallPrompt(null);
      });
    } else {
      toast({
        title: t('ui.info'),
        description: "To install, please use your browser's 'Add to Home Screen' function",
      });
    }
  };
  
  if (isAlreadyInstalled) {
    return (
      <div className="container max-w-4xl mx-auto py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl"/>{t('download.title')}</div>
            <CardDescription>{t('download.alreadyInstalled')}</CardDescription>
          <CardContent>
            <p className="text-center py-8 text-xl">{t('download.alreadyInstalled')}</CardContent>
          <CardFooter className="flex justify-center"/>
            <Button variant="outline" onClick={() => window.history.back()}>
              {t('ui.back')}
            </CardFooter>
        </CardDescription>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">{t('download.title')}</div>
      <p className="text-lg mb-8">{t('download.description')}</p>
      
      <Tabs defaultValue="android" className="w-full"/>
        <TabsList className="grid grid-cols-3 mb-8"/>
          <TabsTrigger value="android"/>Android</Tabs>
          <TabsTrigger value="macos"/>macOS</TabsTrigger>
          <TabsTrigger value="pwa"/>Web App</TabsTrigger>
        
        {/* Android Tab */}
        <TabsContent value="android"/>
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">📱</TabsTrigger> 
                  {t('download.android')}
                </div>
              <CardDescription>{t('download.androidDescription')}</CardDescription>
            <CardContent className="space-y-4"/>
              <div className="flex justify-center">
                {/* In a real app, you would use:
                <QRCode 
                  value={ANDROID_APK_URL}
                  size={200}
                  level="H"
                  includeMargin={true}
   /> */}
                <div className="w-48 h-48 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                  QR Code Placeholder for {ANDROID_APK_URL}
                </CardDescription>
              </div>
              
              <div className="text-center mt-4">
                <p>{t('download.scanQRCode')}</div>
              </div>
            <CardFooter className="flex justify-center gap-4"/>
              <Button onClick={downloadAndroid}/>{t('download.downloadAndroid')}</CardFooter>
              <Button variant="outline" onClick={() => handleCopyLink(ANDROID_APK_URL)}>
                {t('download.copyLink')}
              </button>
          </Card>
        
        {/* macOS Tab */}
        <TabsContent value="macos"/>
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">💻</button>
                  {t('download.desktop')}
                </div>
              <CardDescription>{t('download.desktopDescription')}</CardDescription>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">{t('download.requirements')}</CardDescription>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>macOS 10.13 High Sierra or later</ul>
                    <li>Apple Silicon or Intel Processor</li>
                    <li>4GB RAM minimum</li>
                    <li>500MB disk space</li>
                </li>
                
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">{t('download.version')}: {APP_VERSION}</div>
                </div>
              </div>
            <CardFooter className="flex justify-center gap-4"/>
              <Button onClick={downloadMacOS}/>{t('download.downloadMacOS')}</CardFooter>
              <Button variant="outline" onClick={() => handleCopyLink(MACOS_APP_URL)}>
                {t('download.copyLink')}
              </button>
          </Card>
        
        {/* PWA Tab */}
        <TabsContent value="pwa"/>
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🌐</button>
                  {t('download.pwa')}
                </div>
              <CardDescription>{t('download.pwaDescription')}</CardDescription>
            <CardContent className="space-y-6"/>
              <div className="flex justify-center">
                {/* In a real app, you would use:
                <QRCode 
                  value={WEB_APP_URL}
                  size={200}
                  level="H"
                  includeMargin={true}
   /> */}
                <div className="w-48 h-48 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                  QR Code Placeholder for {WEB_APP_URL}
                </CardDescription>
              </div>
              
              <div className="text-center">
                <p>{t('download.pwaInstructions')}</div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">{t('download.whyDownload')}</Separator>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</ul>
                    <span>{t('download.feature1')}</span>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{t('download.feature2')}</span>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{t('download.feature3')}</span>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{t('download.feature4')}</span>
                </span>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{t('download.pwaRequirements')}</div>
                <p className="text-sm">{t('download.offlineSupport')}</p>
              </div>
            <CardFooter className="flex justify-center gap-4"/>
              <Button onClick={handlePWAInstall}/>{t('download.installPWA')}</CardFooter>
              <Button variant="outline" onClick={() => handleCopyLink(WEB_APP_URL)}>
                {t('download.copyLink')}
              </button>
          </Card>
      </button>
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 