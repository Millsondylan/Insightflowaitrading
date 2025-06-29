import React from 'react';
import { Tabs } from 'expo-router';
import { Home, LineChart, BookOpen, BarChart, Settings } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabsLayout() {
  const { t } = useTranslation('common');
  const { colorScheme } = useColorScheme();
  
  const isDark = colorScheme === 'dark';
  const activeColor = '#3B82F6'; // primary color
  const inactiveColor = isDark ? '#9CA3AF' : '#6B7280'; // muted color
  const backgroundColor = isDark ? '#121212' : '#FFFFFF';
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor,
          borderTopColor: isDark ? '#333333' : '#E5E5E5',
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.home'),
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="strategy"
        options={{
          title: t('nav.strategy'),
          tabBarIcon: ({ color, size }) => <LineChart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: t('nav.journal'),
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="markets"
        options={{
          title: t('nav.markets'),
          tabBarIcon: ({ color, size }) => <BarChart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('nav.settings'),
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
} 