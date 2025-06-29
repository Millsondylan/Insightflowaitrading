import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, ArrowDownRight, Save, AlertTriangle, ArrowRightLeft, X } from 'lucide-react-native';
import { formatDistance } from 'date-fns';

interface SetupData {
  id?: string;
  direction: 'long' | 'short' | 'neutral';
  entry: number | { min: number; max: number };
  stopLoss: number;
  takeProfit: number | number[];
  timeCreated: string;
  confidence: number;
  description: string;
  keyLevels?: number[];
  indicators?: {
    name: string;
    value: string | number;
    interpretation: string;
  }[];
}

interface SetupCardProps {
  setupData: SetupData;
  symbol: string;
  timeframe: string;
  onSaveToJournal: () => void;
  isSaving: boolean;
}

export default function SetupCard({
  setupData,
  symbol,
  timeframe,
  onSaveToJournal,
  isSaving,
}: SetupCardProps) {
  const { t } = useTranslation('common');
  
  if (!setupData) {
    return (
      <View className="p-4 items-center">
        <Text className="text-text-secondary">{t('markets.no_setup_data')}</Text>
      </View>
    );
  }
  
  // Format entry price
  const formatEntry = (entry: number | { min: number; max: number }) => {
    if (typeof entry === 'number') {
      return entry.toFixed(5);
    } else {
      return `${entry.min.toFixed(5)} - ${entry.max.toFixed(5)}`;
    }
  };
  
  // Format take profit
  const formatTakeProfit = (tp: number | number[]) => {
    if (Array.isArray(tp)) {
      return tp.map(level => level.toFixed(5)).join(' / ');
    } else {
      return tp.toFixed(5);
    }
  };
  
  // Get direction color
  const getDirectionColor = (direction: string) => {
    if (direction === 'long') return '#10B981';
    if (direction === 'short') return '#EF4444';
    return '#9CA3AF';
  };
  
  // Get direction icon
  const getDirectionIcon = (direction: string) => {
    if (direction === 'long') return <ArrowUpRight size={18} color="#10B981" />;
    if (direction === 'short') return <ArrowDownRight size={18} color="#EF4444" />;
    return <ArrowRightLeft size={18} color="#9CA3AF" />;
  };
  
  // Get confidence level styling
  const getConfidenceStyle = (confidence: number) => {
    if (confidence >= 75) return 'text-status-success';
    if (confidence >= 50) return 'text-status-warning';
    return 'text-status-error';
  };
  
  return (
    <View className="bg-background-secondary p-4">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <View
            className={`w-8 h-8 rounded-full items-center justify-center mr-3`}
            style={{ backgroundColor: `${getDirectionColor(setupData.direction)}20` }}
          >
            {getDirectionIcon(setupData.direction)}
          </View>
          <View>
            <Text className="text-text-primary font-semibold">
              {t(`markets.${setupData.direction}_setup`)} {symbol}
            </Text>
            <Text className="text-text-secondary text-xs">
              {timeframe} • {
                formatDistance(
                  new Date(setupData.timeCreated), 
                  new Date(), 
                  { addSuffix: true }
                )
              }
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          className="bg-primary px-3 py-2 rounded-md flex-row items-center"
          onPress={onSaveToJournal}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Save size={14} color="#FFFFFF" />
              <Text className="text-white text-xs font-medium ml-1">
                {t('markets.save')}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView className="max-h-72">
        {/* Levels */}
        <View className="bg-background-primary rounded-md p-3 mb-4">
          <View className="flex-row flex-wrap">
            <View className="w-1/2 mb-3 pr-2">
              <Text className="text-text-secondary text-xs">
                {t('markets.entry')}
              </Text>
              <Text className="text-text-primary font-medium">
                {formatEntry(setupData.entry)}
              </Text>
            </View>
            
            <View className="w-1/2 mb-3 pl-2">
              <Text className="text-text-secondary text-xs">
                {t('markets.stop_loss')}
              </Text>
              <Text className="text-status-error font-medium">
                {setupData.stopLoss.toFixed(5)}
              </Text>
            </View>
            
            <View className="w-1/2 pr-2">
              <Text className="text-text-secondary text-xs">
                {t('markets.take_profit')}
              </Text>
              <Text className="text-status-success font-medium">
                {formatTakeProfit(setupData.takeProfit)}
              </Text>
            </View>
            
            <View className="w-1/2 pl-2">
              <Text className="text-text-secondary text-xs">
                {t('markets.confidence')}
              </Text>
              <Text className={`${getConfidenceStyle(setupData.confidence)} font-medium`}>
                {setupData.confidence}%
              </Text>
            </View>
          </View>
        </View>
        
        {/* Description */}
        <View className="mb-4">
          <Text className="text-text-primary font-medium mb-1">
            {t('markets.analysis')}
          </Text>
          <Text className="text-text-secondary">
            {setupData.description}
          </Text>
        </View>
        
        {/* Key Levels */}
        {setupData.keyLevels && setupData.keyLevels.length > 0 && (
          <View className="mb-4">
            <Text className="text-text-primary font-medium mb-1">
              {t('markets.key_levels')}
            </Text>
            <View className="flex-row flex-wrap">
              {setupData.keyLevels.map((level, index) => (
                <View
                  key={index}
                  className="bg-background-interactive rounded-full px-3 py-1 mr-2 mb-2"
                >
                  <Text className="text-text-secondary text-xs">
                    {level.toFixed(5)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Indicators */}
        {setupData.indicators && setupData.indicators.length > 0 && (
          <View>
            <Text className="text-text-primary font-medium mb-1">
              {t('markets.indicators')}
            </Text>
            {setupData.indicators.map((indicator, index) => (
              <View 
                key={index}
                className="bg-background-interactive p-3 rounded-md mb-2"
              >
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-text-primary font-medium">
                    {indicator.name}
                  </Text>
                  <Text className="text-primary">
                    {typeof indicator.value === 'number' 
                      ? indicator.value.toFixed(2)
                      : indicator.value}
                  </Text>
                </View>
                <Text className="text-text-secondary text-xs">
                  {indicator.interpretation}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
} 