import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth';
import { fetchDashboardData } from '@/api/dashboard';

// Components
import DashboardHeader from '@components/dashboard/DashboardHeader';
import PnLSummaryCard from '@components/dashboard/PnLSummaryCard';
import WatchlistCard from '@components/dashboard/WatchlistCard';
import UpcomingLessonCard from '@components/dashboard/UpcomingLessonCard';
import StrategyPerformanceCard from '@components/dashboard/StrategyPerformanceCard';
import AlertsFeedCard from '@components/dashboard/AlertsFeedCard';
import MarketSetupCard from '@components/dashboard/MarketSetupCard';

export default function HomeScreen() {
  const { t } = useTranslation('common');
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: () => fetchDashboardData(user?.id),
    enabled: !!user?.id,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Show loading state while data is being fetched
  if (isLoading && !data) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary">
        <StatusBar style="light" />
        <DashboardHeader />
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-primary text-lg">Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Handle error state
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary">
        <StatusBar style="light" />
        <DashboardHeader />
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-status-error text-lg mb-2">Failed to load dashboard data</Text>
          <Text className="text-text-secondary text-center mb-6">
            Please check your connection and try again
          </Text>
          <Link href="." asChild>
            <Button variant="primary" onPress={() => refetch()}>
              Retry
            </Button>
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  // Render the dashboard
  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <StatusBar style="light" />
      <DashboardHeader />
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4 space-y-4">
          {/* Portfolio Performance */}
          <PnLSummaryCard data={data?.pnlSummary} />
          
          {/* Market Setup */}
          <MarketSetupCard setup={data?.latestSetup} />
          
          {/* Watchlist */}
          <WatchlistCard pairs={data?.watchlist} />
          
          {/* Latest Alerts */}
          <AlertsFeedCard alerts={data?.alerts} />
          
          {/* Strategy Performance */}
          <StrategyPerformanceCard strategies={data?.strategies} />
          
          {/* Next Academy Lesson */}
          <UpcomingLessonCard lesson={data?.nextLesson} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Temporary Button component until we create a UI component library
function Button({ children, variant = 'primary', onPress }) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-white px-4 py-3 rounded-md';
      case 'secondary':
        return 'bg-secondary text-white px-4 py-3 rounded-md';
      case 'outline':
        return 'bg-transparent border border-border-primary text-text-primary px-4 py-3 rounded-md';
      default:
        return 'bg-primary text-white px-4 py-3 rounded-md';
    }
  };

  return (
    <View className={getButtonStyle()}>
      <Text className="font-medium text-center" onPress={onPress}>
        {children}
      </Text>
    </View>
  );
} 