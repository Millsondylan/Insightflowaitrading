import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { usePathname } from '@react-navigation/native';
import { Home, BarChart, BookOpen, Settings } from 'lucide-react-native';
import { useAuthStore } from '../../store/auth';

interface TabItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  requiresAuth: boolean;
}

export default function BottomTabNavigator() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  
  const tabs: TabItem[] = [
    {
      name: 'Home',
      path: '/',
      icon: <Home size={24} stroke="#fff" />,
      requiresAuth: false,
    },
    {
      name: 'Markets',
      path: '/markets',
      icon: <BarChart size={24} stroke="#fff" />,
      requiresAuth: false,
    },
    {
      name: 'Academy',
      path: '/academy',
      icon: <BookOpen size={24} stroke="#fff" />,
      requiresAuth: true,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings size={24} stroke="#fff" />,
      requiresAuth: false,
    },
  ];
  
  // Filter tabs based on auth status
  const visibleTabs = tabs.filter(tab => !tab.requiresAuth || user);
  
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <View style={styles.container}>
      {visibleTabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={[
            styles.tabButton,
            isActive(tab.path) && styles.activeTabButton
          ]}
          onPress={() => router.push(tab.path)}
        >
          <View style={styles.tabContent}>
            {React.cloneElement(tab.icon, {
              stroke: isActive(tab.path) ? '#3b82f6' : '#94a3b8'
            })}
            <Text
              style={[
                styles.tabLabel,
                isActive(tab.path) && styles.activeTabLabel
              ]}
            >
              {tab.name}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingBottom: 8,
    paddingTop: 12,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  activeTabButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#94a3b8',
  },
  activeTabLabel: {
    color: '#3b82f6',
    fontWeight: '500',
  },
}); 