
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, QrCode, Phone, Laptop, TabletSmartphone } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { QRCodeSVG } from 'qrcode.react';

export default function DownloadPage() {
  // Mock translation function for now
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'download.title': 'Download',
      'download.description': 'Download InsightFlow AI Trading App',
      'download.subtitle': 'Get the mobile and desktop apps',
      'download.android': 'Android',
      'download.desktop': 'Desktop',
      'download.pwa': 'PWA',
      'download.androidDescription': 'Download for Android devices',
      'download.desktopDescription': 'Download for desktop',
      'download.pwaDescription': 'Install as a Progressive Web App',
      'download.scanQRCode': 'Scan QR code to download',
      'download.downloadAndroid': 'Download for Android',
      'download.downloadMacOS': 'Download for macOS',
      'download.requirements': 'Requirements',
      'download.version': 'Version',
      'download.pwaInstructions': 'Scan QR code or install directly',
      'download.copyLink': 'Copy Link',
      'download.installPWA': 'Install PWA',
      'download.alreadyInstalled': 'Already installed',
      'download.pwaRequirements': 'Works on modern browsers',
      'download.offlineSupport': 'Offline support included',
      'download.whyDownload': 'Why Download?',
      'download.feature1': 'Faster performance',
      'download.feature2': 'Offline access',
      'download.feature3': 'Push notifications',
      'download.feature4': 'Native experience'
    };
    return translations[key] || key;
  };
  
  const isNative = Capacitor.isNativePlatform();
  
  // Define app download URLs
  const downloadUrls = {
    android: 'https://insightflow.ai/download/android',
    macos: 'https://insightflow.ai/download/macos',
    pwa: window.location.origin
  };
  
  return (
    <>
      <Helmet>
        <title>{t('download.title')} | InsightFlow AI Trading</title>
        <meta name="description" content={t('download.description')} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
              {t('download.title')}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t('download.subtitle')}
            </p>
          </div>
          
          <Tabs defaultValue="mobile" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="mobile">
                <Phone className="mr-2 h-4 w-4"/>
                <span>{t('download.android')}</span>
              </TabsTrigger>
              <TabsTrigger value="desktop">
                <Laptop className="mr-2 h-4 w-4"/>
                <span>{t('download.desktop')}</span>
              </TabsTrigger>
              <TabsTrigger value="pwa">
                <TabletSmartphone className="mr-2 h-4 w-4"/>
                <span>{t('download.pwa')}</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Android Tab */}
            <TabsContent value="mobile">
              <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{t('download.android')}</CardTitle>
                  <CardDescription>{t('download.androidDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-lg mb-6">
                    <QRCodeSVG 
                      value={downloadUrls.android}
                      size={200}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="H"
                      includeMargin
                    />
                  </div>
                  <div className="text-sm text-center mb-6 text-gray-300">
                    {t('download.scanQRCode')}
                  </div>
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                    <Download className="mr-2 h-4 w-4"/>
                    {t('download.downloadAndroid')}
                  </Button>
                </CardContent>
                <CardFooter className="flex flex-col text-sm text-gray-400">
                  <p className="mb-2">{t('download.requirements')}: Android 7.0+</p>
                  <p>{t('download.version')}: 1.0.0</p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Desktop Tab */}
            <TabsContent value="desktop">
              <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{t('download.desktop')}</CardTitle>
                  <CardDescription>{t('download.desktopDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-lg mb-6">
                    <QRCodeSVG 
                      value={downloadUrls.macos}
                      size={200}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="H"
                      includeMargin
                    />
                  </div>
                  <div className="text-sm text-center mb-6 text-gray-300">
                    {t('download.scanQRCode')}
                  </div>
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <Download className="mr-2 h-4 w-4"/>
                    {t('download.downloadMacOS')}
                  </Button>
                </CardContent>
                <CardFooter className="flex flex-col text-sm text-gray-400">
                  <p className="mb-2">{t('download.requirements')}: macOS 10.15+</p>
                  <p>{t('download.version')}: 1.0.0</p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* PWA Tab */}
            <TabsContent value="pwa">
              <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{t('download.pwa')}</CardTitle>
                  <CardDescription>{t('download.pwaDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-lg mb-6">
                    <QRCodeSVG 
                      value={downloadUrls.pwa}
                      size={200}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="H"
                      includeMargin
                    />
                  </div>
                  <div className="text-sm text-center mb-6 text-gray-300">
                    {t('download.pwaInstructions')}
                  </div>
                  {!isNative && (
                    <div className="flex gap-3 justify-center flex-wrap">
                      <Button variant="outline" className="gap-2" onClick={() => navigator.clipboard.writeText(window.location.origin)}>
                        <QrCode size={16}/>
                        {t('download.copyLink')}
                      </Button>
                      <Button className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600">
                        <Download size={16}/>
                        {t('download.installPWA')}
                      </Button>
                    </div>
                  )}
                  {isNative && (
                    <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-md text-green-300">
                      {t('download.alreadyInstalled')}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col text-sm text-gray-400">
                  <p className="mb-2">{t('download.pwaRequirements')}</p>
                  <p>{t('download.offlineSupport')}</p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-12 p-6 border border-white/10 rounded-lg bg-gray-900/50">
            <h2 className="text-xl font-bold mb-4">{t('download.whyDownload')}</h2>
            <ul className="grid gap-3 md:grid-cols-2">
              <li className="flex items-start gap-2">
                <div className="mt-1 bg-blue-500/20 p-1 rounded-full">
                  <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span>{t('download.feature1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 bg-blue-500/20 p-1 rounded-full">
                  <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span>{t('download.feature2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 bg-blue-500/20 p-1 rounded-full">
                  <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span>{t('download.feature3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 bg-blue-500/20 p-1 rounded-full">
                  <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span>{t('download.feature4')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
