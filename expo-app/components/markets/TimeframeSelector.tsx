import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

interface TimeframeSelectorProps {
  timeframes: string[];
  selectedTimeframe: string;
  onSelectTimeframe: (timeframe: string) => void;
}

export default function TimeframeSelector({
  timeframes,
  selectedTimeframe,
  onSelectTimeframe,
}: TimeframeSelectorProps) {
  const { t } = useTranslation('common');
  
  return (
    <View className="border-b border-border-primary">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <View className="flex-row py-2">
          {timeframes.map((timeframe) => (
            <TouchableOpacity
              key={timeframe}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedTimeframe === timeframe
                  ? 'bg-primary'
                  : 'bg-background-interactive'
              }`}
              onPress={() => onSelectTimeframe(timeframe)}
            >
              <Text
                className={`font-medium ${
                  selectedTimeframe === timeframe
                    ? 'text-white'
                    : 'text-text-secondary'
                }`}
              >
                {timeframe}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
} 