import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Plus, Filter, Search, ChevronRight, Lightbulb } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { fetchUserStrategies } from '@/api/strategy';
import { useAuthStore } from '@/store/auth';
import StrategyCard from '@components/strategy/StrategyCard';

export default function StrategyScreen() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch user strategies
  const { data: strategies, isLoading, error, refetch } = useQuery({
    queryKey: ['userStrategies', user?.id],
    queryFn: () => fetchUserStrategies(user?.id),
    enabled: !!user?.id,
  });
  
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  
  // Navigate to strategy builder
  const navigateToBuilder = () => {
    router.push('/strategy/builder');
  };
  
  // Filter strategies based on search
  const filteredStrategies = searchQuery 
    ? strategies?.filter(strategy => 
        strategy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        strategy.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        strategy.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : strategies;
  
  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <View className="px-4 py-4 flex-row justify-between items-center">
        <Text className="text-text-primary text-xl font-bold">
          {t('strategy.your_strategies')}
        </Text>
        
        <TouchableOpacity
          onPress={navigateToBuilder}
          className="bg-primary w-10 h-10 rounded-full items-center justify-center"
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {/* Search and filter bar */}
      <View className="px-4 pb-4">
        <View className="flex-row">
          <View className="bg-background-interactive rounded-lg flex-row items-center px-3 flex-1 mr-2">
            <Search size={18} color="#9CA3AF" />
            <TextInput
              className="py-3 px-2 flex-1 text-text-primary"
              placeholder={t('strategy.search_placeholder')}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <TouchableOpacity className="bg-background-interactive p-3 rounded-lg">
            <Filter size={20} color="#E5E5E5" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* AI Strategy Suggestions */}
      <TouchableOpacity 
        className="mx-4 mb-4 p-4 bg-background-secondary rounded-lg border border-border-primary"
        onPress={() => router.push('/strategy/ai-suggestions')}
      >
        <View className="flex-row items-center">
          <View className="bg-accent/20 w-10 h-10 rounded-full items-center justify-center mr-3">
            <Lightbulb size={20} color="#8B5CF6" />
          </View>
          <View className="flex-1">
            <Text className="text-text-primary font-semibold">
              {t('strategy.ai_suggestions')}
            </Text>
            <Text className="text-text-secondary text-sm mt-1">
              {t('strategy.ai_suggestions_desc')}
            </Text>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
      
      {/* Strategy List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-text-secondary mt-3">
            {t('strategy.loading_strategies')}
          </Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-status-error text-lg mb-2">
            {t('strategy.error_loading')}
          </Text>
          <Text className="text-text-secondary text-center mb-6">
            {t('strategy.try_again')}
          </Text>
          <TouchableOpacity
            className="bg-primary px-6 py-3 rounded-lg"
            onPress={() => refetch()}
          >
            <Text className="text-white font-medium">
              {t('common.retry')}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredStrategies?.length === 0 ? (
            <View className="items-center justify-center py-10">
              <Text className="text-text-secondary text-center">
                {searchQuery ? t('strategy.no_search_results') : t('strategy.no_strategies')}
              </Text>
              
              {!searchQuery && (
                <TouchableOpacity
                  className="bg-primary px-6 py-3 rounded-lg mt-4"
                  onPress={navigateToBuilder}
                >
                  <Text className="text-white font-medium">
                    {t('strategy.create_first')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View className="px-4 pb-6">
              {filteredStrategies?.map((strategy) => (
                <StrategyCard
                  key={strategy.id}
                  strategy={strategy}
                  onPress={() => router.push(`/strategy/${strategy.id}`)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
} 