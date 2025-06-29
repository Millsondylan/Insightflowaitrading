import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Star, Clock, ChevronUp, ChevronDown, Download, Share2, MessageCircle } from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import { useAuthStore } from '@/store/auth';
import { getMarketDetail, generateMarketSetup, toggleFavorite } from '@/api/markets';
import { saveSetupToJournal } from '@/api/journal';
import TimeframeSelector from '@components/markets/TimeframeSelector';
import PriceInfoCard from '@components/markets/PriceInfoCard';
import SetupCard from '@components/markets/SetupCard';

// Available timeframes
const TIMEFRAMES = ['M5', 'M15', 'M30', 'H1', 'H4', 'D1'];

export default function MarketDetailScreen() {
  const { symbol } = useLocalSearchParams();
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useAuthStore();
  const webViewRef = useRef(null);
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('H1');
  const [showingSetup, setShowingSetup] = useState(false);
  
  // Fetch market details
  const { 
    data: marketData, 
    isLoading: isLoadingMarket, 
    error: marketError,
    refetch: refetchMarketData,
  } = useQuery({
    queryKey: ['marketDetail', symbol],
    queryFn: () => getMarketDetail(symbol as string),
    enabled: !!symbol,
  });
  
  // Generate AI setup
  const setupMutation = useMutation({
    mutationFn: () => generateMarketSetup(symbol as string, selectedTimeframe, user?.id),
    onError: (error) => {
      Alert.alert(
        t('markets.error_generating_setup'),
        t('markets.try_again_later'),
        [{ text: t('common.ok') }]
      );
    },
    onSuccess: () => {
      setShowingSetup(true);
    }
  });
  
  // Toggle favorite status
  const favoriteMutation = useMutation({
    mutationFn: (isFavorite: boolean) => 
      toggleFavorite(user?.id, symbol as string, isFavorite),
    onSuccess: () => {
      refetchMarketData();
    }
  });
  
  // Save setup to journal
  const saveToJournalMutation = useMutation({
    mutationFn: () => saveSetupToJournal(
      user?.id,
      symbol as string,
      selectedTimeframe,
      setupMutation.data
    ),
    onSuccess: () => {
      Alert.alert(
        t('markets.setup_saved'),
        t('markets.view_in_journal'),
        [
          {
            text: t('markets.go_to_journal'),
            onPress: () => router.push('/journal')
          },
          {
            text: t('common.close'),
            style: 'cancel'
          }
        ]
      );
    }
  });
  
  // Create TradingView widget script
  const getTradingViewScript = () => {
    return `
      new TradingView.widget({
        "width": "100%",
        "height": "100%",
        "symbol": "${symbol}",
        "interval": "${selectedTimeframe}",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#121212",
        "enable_publishing": false,
        "hide_top_toolbar": false,
        "hide_side_toolbar": true,
        "save_image": false,
        "container_id": "tradingview_chart"
      });
    `;
  };
  
  // Handle timeframe change
  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
    setShowingSetup(false);
    
    // Update the chart
    if (webViewRef.current) {
      const script = `
        try {
          widget.setSymbol("${symbol}", "${timeframe}");
          true;
        } catch(e) {
          false;
        }
      `;
      webViewRef.current.injectJavaScript(script);
    }
  };
  
  // Handle generate setup
  const handleGenerateSetup = () => {
    setupMutation.mutate();
  };
  
  // Handle toggle favorite
  const handleToggleFavorite = () => {
    favoriteMutation.mutate(!marketData?.isFavorite);
  };
  
  // Handle save to journal
  const handleSaveToJournal = () => {
    if (!setupMutation.data) {
      Alert.alert(
        t('markets.no_setup'),
        t('markets.generate_setup_first'),
        [{ text: t('common.ok') }]
      );
      return;
    }
    
    saveToJournalMutation.mutate();
  };
  
  // Chart HTML
  const chartHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #121212;
          overflow: hidden;
        }
        #tradingview_chart {
          height: 100vh;
          width: 100vw;
        }
      </style>
    </head>
    <body>
      <div id="tradingview_chart"></div>
      <script type="text/javascript">
        const widget = ${getTradingViewScript()}
      </script>
    </body>
    </html>
  `;
  
  if (isLoadingMarket) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }
  
  if (marketError || !marketData) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary">
        <View className="px-4 py-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#E5E5E5" />
          </TouchableOpacity>
          
          <Text className="text-text-primary font-semibold text-lg ml-4">
            {t('markets.error')}
          </Text>
        </View>
        
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-status-error text-lg mb-2 text-center">
            {t('markets.error_loading_market')}
          </Text>
          <TouchableOpacity
            className="bg-primary px-6 py-3 rounded-lg mt-4"
            onPress={() => refetchMarketData()}
          >
            <Text className="text-white font-medium">
              {t('common.retry')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      {/* Header */}
      <View className="px-4 py-3 flex-row items-center justify-between border-b border-border-primary">
        <View className="flex-row items-center">
          <TouchableOpacity 
            className="mr-3" 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#E5E5E5" />
          </TouchableOpacity>
          
          <View>
            <Text className="text-text-primary font-semibold text-lg">
              {marketData.symbol}
            </Text>
            <Text className="text-text-secondary text-xs">
              {marketData.name}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity onPress={handleToggleFavorite}>
          <Star 
            size={24} 
            color={marketData.isFavorite ? '#F59E0B' : '#4B4B4B'} 
            fill={marketData.isFavorite ? '#F59E0B' : 'transparent'} 
          />
        </TouchableOpacity>
      </View>
      
      {/* Price Info */}
      <PriceInfoCard marketData={marketData} />
      
      {/* Timeframe Selector */}
      <TimeframeSelector 
        timeframes={TIMEFRAMES} 
        selectedTimeframe={selectedTimeframe}
        onSelectTimeframe={handleTimeframeChange}
      />
      
      {/* Chart */}
      <View className="flex-1">
        <WebView
          ref={webViewRef}
          source={{ html: chartHtml }}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View className="absolute bg-background-primary flex-1 w-full h-full items-center justify-center">
              <ActivityIndicator size="large" color="#3B82F6" />
            </View>
          )}
          style={{ backgroundColor: '#121212' }}
        />
      </View>
      
      {/* Setup Generator Button */}
      {!showingSetup ? (
        <View className="px-4 py-3 border-t border-border-primary">
          <TouchableOpacity 
            className={`bg-primary rounded-lg py-4 flex-row justify-center items-center ${
              setupMutation.isPending ? 'opacity-70' : ''
            }`}
            onPress={handleGenerateSetup}
            disabled={setupMutation.isPending}
          >
            {setupMutation.isPending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text className="text-white font-semibold mr-2">
                  {t('markets.generate_setup')}
                </Text>
                <Clock size={18} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View className="border-t border-border-primary">
          <SetupCard 
            setupData={setupMutation.data} 
            symbol={symbol as string}
            timeframe={selectedTimeframe}
            onSaveToJournal={handleSaveToJournal}
            isSaving={saveToJournalMutation.isPending}
          />
        </View>
      )}
    </SafeAreaView>
  );
} 