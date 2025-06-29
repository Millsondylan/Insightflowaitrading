import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Search, TrendingUp, TrendingDown, Star, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { fetchMarketData, toggleFavorite } from '@/api/markets';
import { useAuthStore } from '@/store/auth';

// Market pair types
const MARKET_TYPES = ['FOREX', 'CRYPTO', 'STOCKS', 'INDICES', 'COMMODITIES'];

export default function MarketsScreen() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('FOREX');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch market data
  const { data: marketsData, isLoading, error, refetch } = useQuery({
    queryKey: ['marketData', activeTab],
    queryFn: () => fetchMarketData(activeTab),
    enabled: !!user,
  });
  
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  
  // Filter markets based on search
  const filteredMarkets = searchQuery 
    ? marketsData?.filter(market => 
        market.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        market.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : marketsData;
  
  // Navigate to market detail
  const navigateToMarket = (symbol: string) => {
    router.push(`/market/${symbol}`);
  };
  
  // Handle favorite toggle
  const handleToggleFavorite = async (symbol: string, isFavorite: boolean) => {
    try {
      await toggleFavorite(user?.id, symbol, !isFavorite);
      refetch();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };
  
  // Render market item
  const renderMarketItem = ({ item }) => {
    const priceChangeColor = item.priceChange >= 0 ? '#10B981' : '#EF4444';
    const PriceChangeIcon = item.priceChange >= 0 ? TrendingUp : TrendingDown;
    
    return (
      <TouchableOpacity
        className="flex-row items-center py-4 px-4 border-b border-border-primary"
        onPress={() => navigateToMarket(item.symbol)}
      >
        <TouchableOpacity
          className="mr-3"
          onPress={() => handleToggleFavorite(item.symbol, item.isFavorite)}
        >
          <Star 
            size={20} 
            color={item.isFavorite ? '#F59E0B' : '#4B4B4B'} 
            fill={item.isFavorite ? '#F59E0B' : 'transparent'} 
          />
        </TouchableOpacity>
        
        <View className="flex-1">
          <Text className="text-text-primary font-medium">{item.symbol}</Text>
          <Text className="text-text-secondary text-xs">{item.name}</Text>
        </View>
        
        <View className="items-end mr-3">
          <Text className="text-text-primary font-medium">{item.price}</Text>
          <View className="flex-row items-center">
            <PriceChangeIcon size={12} color={priceChangeColor} />
            <Text
              className={`text-xs ml-1`}
              style={{ color: priceChangeColor }}
            >
              {item.priceChange >= 0 ? '+' : ''}{item.priceChange.toFixed(2)}%
            </Text>
          </View>
        </View>
        
        <ChevronRight size={20} color="#9CA3AF" />
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      {/* Header */}
      <View className="px-4 py-4">
        <Text className="text-text-primary text-xl font-bold mb-4">
          {t('markets.title')}
        </Text>
        
        {/* Search bar */}
        <View className="bg-background-interactive rounded-lg flex-row items-center px-3 mb-4">
          <Search size={18} color="#9CA3AF" />
          <TextInput
            className="py-3 px-2 flex-1 text-text-primary"
            placeholder={t('markets.search_placeholder')}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {/* Market type tabs */}
        <FlatList
          horizontal
          data={MARKET_TYPES}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          className="mb-2"
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`px-4 py-2 rounded-full mr-2 ${
                activeTab === item ? 'bg-primary' : 'bg-background-interactive'
              }`}
              onPress={() => setActiveTab(item)}
            >
              <Text
                className={`${
                  activeTab === item ? 'text-white' : 'text-text-secondary'
                } font-medium`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      
      {/* Markets list */}
      <FlatList
        data={filteredMarkets}
        keyExtractor={(item) => item.symbol}
        renderItem={renderMarketItem}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-10">
            <Text className="text-text-secondary">
              {isLoading
                ? t('markets.loading')
                : error
                ? t('markets.error_loading')
                : searchQuery
                ? t('markets.no_search_results')
                : t('markets.no_markets')}
            </Text>
            {error && (
              <TouchableOpacity
                className="bg-primary px-6 py-3 rounded-lg mt-4"
                onPress={() => refetch()}
              >
                <Text className="text-white font-medium">
                  {t('common.retry')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
} 