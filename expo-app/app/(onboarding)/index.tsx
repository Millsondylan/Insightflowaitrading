import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react-native';
import { useOnboardingStore } from '@/store/onboarding';

export default function OnboardingWelcome() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { setHasSeenWelcome } = useOnboardingStore();
  
  const handleContinue = () => {
    setHasSeenWelcome(true);
    router.push('/(onboarding)/experience');
  };
  
  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <View className="flex-1 justify-between p-6">
        {/* Header */}
        <View className="items-center pt-10">
          <Image
            source={require('@assets/logo.png')}
            className="w-24 h-24"
            resizeMode="contain"
          />
          <Text className="text-text-primary text-3xl font-bold mt-6 text-center">
            {t('onboarding.welcome_title')}
          </Text>
          <Text className="text-text-secondary text-base mt-3 text-center px-4">
            {t('onboarding.welcome_subtitle')}
          </Text>
        </View>
        
        {/* Features List */}
        <View className="py-10">
          <FeatureItem
            title={t('onboarding.feature_1_title')}
            description={t('onboarding.feature_1_desc')}
            iconName="strategy"
          />
          
          <FeatureItem
            title={t('onboarding.feature_2_title')}
            description={t('onboarding.feature_2_desc')}
            iconName="ai"
          />
          
          <FeatureItem
            title={t('onboarding.feature_3_title')}
            description={t('onboarding.feature_3_desc')}
            iconName="charts"
          />
          
          <FeatureItem
            title={t('onboarding.feature_4_title')}
            description={t('onboarding.feature_4_desc')}
            iconName="journal"
          />
        </View>
        
        {/* Continue Button */}
        <View className="pb-6">
          <TouchableOpacity
            onPress={handleContinue}
            className="bg-primary rounded-lg py-4 flex-row justify-center items-center"
          >
            <Text className="text-white font-semibold text-lg mr-2">
              {t('onboarding.continue')}
            </Text>
            <ChevronRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Feature item component
const FeatureItem = ({ title, description, iconName }) => {
  // This would be replaced with actual icons in a real implementation
  const getIcon = (name) => {
    const iconMap = {
      strategy: '📈',
      ai: '🧠',
      charts: '📊',
      journal: '📝',
    };
    
    return iconMap[name] || '✨';
  };
  
  return (
    <View className="flex-row items-start mb-6">
      <View className="bg-background-interactive w-10 h-10 rounded-full items-center justify-center mr-4">
        <Text className="text-xl">{getIcon(iconName)}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-text-primary font-semibold text-lg">
          {title}
        </Text>
        <Text className="text-text-secondary mt-1">
          {description}
        </Text>
      </View>
    </View>
  );
}; 