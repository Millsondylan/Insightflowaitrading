import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight, TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

interface StrategyPerformance {
  winRate: number;
  pnl: number;
  totalTrades: number;
  profitFactor?: number;
}

interface StrategyCardProps {
  strategy: {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
    tags?: string[];
    performance?: StrategyPerformance;
  };
  onPress: () => void;
}

export default function StrategyCard({ strategy, onPress }: StrategyCardProps) {
  const { t } = useTranslation('common');
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Get performance colors and icons
  const getPerformanceColor = (pnl: number) => {
    if (pnl > 0) return '#10B981'; // Green for positive
    if (pnl < 0) return '#EF4444'; // Red for negative
    return '#9CA3AF'; // Gray for neutral
  };
  
  const getPerformanceIcon = (pnl: number) => {
    if (pnl > 0) return <ArrowUpRight size={16} color="#10B981" />;
    if (pnl < 0) return <ArrowDownRight size={16} color="#EF4444" />;
    return <Minus size={16} color="#9CA3AF" />;
  };
  
  const formatPnL = (pnl: number) => {
    if (pnl > 0) return `+${pnl.toFixed(2)}%`;
    if (pnl < 0) return `${pnl.toFixed(2)}%`;
    return '0.00%';
  };
  
  return (
    <TouchableOpacity 
      className="bg-background-secondary p-4 rounded-lg mb-3 border border-border-primary"
      onPress={onPress}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-2">
          <Text className="text-text-primary font-semibold text-lg">
            {strategy.name}
          </Text>
          {strategy.description && (
            <Text className="text-text-secondary text-sm mt-1" numberOfLines={2}>
              {strategy.description}
            </Text>
          )}
        </View>
        
        <ChevronRight size={20} color="#9CA3AF" />
      </View>
      
      {/* Tags */}
      {strategy.tags && strategy.tags.length > 0 && (
        <View className="flex-row flex-wrap mt-3">
          {strategy.tags.slice(0, 3).map((tag, index) => (
            <View 
              key={index}
              className="bg-background-interactive rounded-full px-3 py-1 mr-2 mb-1"
            >
              <Text className="text-text-secondary text-xs">
                {tag}
              </Text>
            </View>
          ))}
          {strategy.tags.length > 3 && (
            <View className="bg-background-interactive rounded-full px-3 py-1">
              <Text className="text-text-secondary text-xs">
                +{strategy.tags.length - 3} {t('common.more')}
              </Text>
            </View>
          )}
        </View>
      )}
      
      {/* Performance info */}
      {strategy.performance && (
        <View className="flex-row justify-between mt-3 pt-3 border-t border-border-primary">
          <View className="flex-row items-center">
            <TrendingUp size={14} color="#9CA3AF" />
            <Text className="text-text-secondary text-xs ml-1">
              {t('strategy.win_rate')}: 
            </Text>
            <Text className="text-text-primary text-xs ml-1">
              {Math.round(strategy.performance.winRate)}%
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <Text className="text-text-secondary text-xs">
              {t('strategy.pnl')}: 
            </Text>
            <Text 
              style={{ color: getPerformanceColor(strategy.performance.pnl) }}
              className="text-xs font-medium ml-1"
            >
              {formatPnL(strategy.performance.pnl)}
            </Text>
          </View>
          
          <Text className="text-text-secondary text-xs">
            {t('strategy.trades')}: {strategy.performance.totalTrades}
          </Text>
        </View>
      )}
      
      {/* Last updated */}
      <Text className="text-text-muted text-xs mt-3">
        {t('common.last_updated')}: {formatDate(strategy.updated_at)}
      </Text>
    </TouchableOpacity>
  );
} 