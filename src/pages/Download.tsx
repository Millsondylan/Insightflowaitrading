import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'next-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, QrCode, Phone, Laptop, TabletSmartphone } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import QRCodeReact from 'qrcode.react';

export default function DownloadPage() {
  const { t } = useTranslation('common');
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
      
      <Div className="container mx-auto px-4 py-12">
        <Div className="max-w-4xl mx-auto">
          <Div className="text-center mb-12">
            <H1 className="text-4xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
              {t('download.title')}
            </Div>
            <P className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t('download.subtitle')}
            </P>
          </Div>
          
          <Tabs defaultValue="mobile" className="w-full" />
            <TabsList className="grid grid-cols-3 mb-8" />
              <TabsTrigger value="mobile" />
                <Phone className="mr-2 h-4 w-4" />
                <Span>{t('download.android')}</Tabs>
              </TabsTrigger>
              <TabsTrigger value="desktop" />
                <Laptop className="mr-2 h-4 w-4" />
                <Span>{t('download.desktop')}</TabsTrigger>
              </TabsTrigger>
              <TabsTrigger value="pwa" />
                <TabletSmartphone className="mr-2 h-4 w-4" />
                <Span>{t('download.pwa')}</TabsTrigger>
              </TabsTrigger>
            </TabsList>
            
            {/* Android Tab */}
            <TabsContent value="mobile" />
              <Card className="border-white/10 bg-black/20 backdrop-blur-sm" />
                <CardHeader>
                  <CardTitle>{t('download.android')}</TabsContent>
                  <CardDescription>{t('download.androidDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center" />
                  <Div className="bg-white p-4 rounded-lg mb-6">
                    <QRCodeReact 
                      value={downloadUrls.android}
                      size={200}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="H"
                      includeMargin
                    />
                  </CardContent>
                  <Div className="text-sm text-center mb-6 text-gray-300">
                    {t('download.scanQRCode')}
                  </Div>
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 text-white" />
                    <Download className="mr-2 h-4 w-4" />
                    {t('download.downloadAndroid')}
                  </Button>
                </CardContent>
                <CardFooter className="flex flex-col text-sm text-gray-400" />
                  <P className="mb-2">{t('download.requirements')}: Android 7.0+</CardFooter>
                  <P>{t('download.version')}: 1.0.0</P>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Desktop Tab */}
            <TabsContent value="desktop" />
              <Card className="border-white/10 bg-black/20 backdrop-blur-sm" />
                <CardHeader>
                  <CardTitle>{t('download.desktop')}</TabsContent>
                  <CardDescription>{t('download.desktopDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center" />
                  <Div className="bg-white p-4 rounded-lg mb-6">
                    <QRCodeReact 
                      value={downloadUrls.macos}
                      size={200}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="H"
                      includeMargin
                    />
                  </CardContent>
                  <Div className="text-sm text-center mb-6 text-gray-300">
                    {t('download.scanQRCode')}
                  </Div>
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white" />
                    <Download className="mr-2 h-4 w-4" />
                    {t('download.downloadMacOS')}
                  </Button>
                </CardContent>
                <CardFooter className="flex flex-col text-sm text-gray-400" />
                  <P className="mb-2">{t('download.requirements')}: macOS 10.15+</CardFooter>
                  <P>{t('download.version')}: 1.0.0</P>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* PWA Tab */}
            <TabsContent value="pwa" />
              <Card className="border-white/10 bg-black/20 backdrop-blur-sm" />
                <CardHeader>
                  <CardTitle>{t('download.pwa')}</TabsContent>
                  <CardDescription>{t('download.pwaDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center" />
                  <Div className="bg-white p-4 rounded-lg mb-6">
                    <QRCodeReact 
                      value={downloadUrls.pwa}
                      size={200}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="H"
                      includeMargin
                    />
                  </CardContent>
                  <Div className="text-sm text-center mb-6 text-gray-300">
                    {t('download.pwaInstructions')}
                  </Div>
                  {!isNative && (
                    <Div className="flex gap-3 justify-center flex-wrap">
                      <Button variant="outline" className="gap-2" onClick={() = /> navigator.clipboard.writeText(window.location.origin)}>
                        <QrCode size={16} />
                        {t('download.copyLink')}
                      </Div>
                      <Button className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600" />
                        <Download size={16} />
                        {t('download.installPWA')}
                      </Button>
                    </Div>
                  )}
                  {isNative && (
                    <Div className="p-4 bg-green-900/20 border border-green-500/30 rounded-md text-green-300">
                      {t('download.alreadyInstalled')}
                    </Div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col text-sm text-gray-400" />
                  <P className="mb-2">{t('download.pwaRequirements')}</CardFooter>
                  <P>{t('download.offlineSupport')}</P>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Div className="mt-12 p-6 border border-white/10 rounded-lg bg-gray-900/50">
            <H2 className="text-xl font-bold mb-4">{t('download.whyDownload')}</Div>
            <Ul className="grid gap-3 md:grid-cols-2">
              <Li className="flex items-start gap-2">
                <Div className="mt-1 bg-blue-500/20 p-1 rounded-full">
                  <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </Ul>
                <Span>{t('download.feature1')}</Span>
              </Li>
              <Li className="flex items-start gap-2">
                <Div className="mt-1 bg-blue-500/20 p-1 rounded-full">
                  <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </Li>
                <Span>{t('download.feature2')}</Span>
              </Li>
              <Li className="flex items-start gap-2">
                <Div className="mt-1 bg-blue-500/20 p-1 rounded-full">
                  <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </Li>
                <Span>{t('download.feature3')}</Span>
              </Li>
              <Li className="flex items-start gap-2">
                <Div className="mt-1 bg-blue-500/20 p-1 rounded-full">
                  <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </Li>
                <Span>{t('download.feature4')}</Span>
              </Li>
            </Ul>
          </Div>
        </Div>
      </Div>
    </>
  );
}

export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 