import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Search } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth';

interface DashboardHeaderProps {
  hasNotifications?: boolean;
}

export default function DashboardHeader({ hasNotifications = false }: DashboardHeaderProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useAuthStore();
  
  const firstName = user?.user_metadata?.first_name || 'Trader';
  
  const navigateToNotifications = () => {
    router.push('/notifications');
  };
  
  const navigateToSearch = () => {
    router.push('/search');
  };
  
  return (
    <View className="px-4 py-2 flex-row items-center justify-between">
      <View>
        <Text className="text-text-secondary text-base">
          {t('dashboard.greeting')}
        </Text>
        <Text className="text-text-primary font-bold text-xl">
          {firstName}
        </Text>
      </View>
      
      <View className="flex-row space-x-4">
        <TouchableOpacity
          onPress={navigateToSearch}
          className="p-2 rounded-full bg-background-interactive"
        >
          <Search size={22} color="#E5E5E5" />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={navigateToNotifications}
          className="p-2 rounded-full bg-background-interactive relative"
        >
          <Bell size={22} color="#E5E5E5" />
          {hasNotifications && (
            <View className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-status-error" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
} 