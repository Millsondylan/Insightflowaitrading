import React, { useState, useEffect } from 'react';
import AdminKPI from '@/components/core/AdminKPI';
import ActivityTimeline from '@/components/core/ActivityTimeline';
import UserTable from '@/components/core/UserTable';
import { fetchDashboardStats, DashboardStats } from '@/lib/admin/fetchDashboardStats';
import { getActivityTimeline, ActivityEvent } from '@/lib/admin/getActivityTimeline';
import { Shield, ListFilter, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import '@/styles/admin.css';

const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [timeline, setTimeline] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const loadAdminData = async () => {
      setLoading(true);
      const [fetchedStats, fetchedTimeline] = await Promise.all([
        fetchDashboardStats(),
        getActivityTimeline(),
      ]);
      setStats(fetchedStats);
      setTimeline(fetchedTimeline);
      setLoading(false);
    };

    loadAdminData();
  }, []);

  const renderLoadingSkeleton = () => (
    <div className="admin-panel">
      <div className="kpi-grid">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-[400px] w-full rounded-2xl" />
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">
            Real-time overview of user activity and key performance indicators.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-green-400">
          <Shield className="h-5 w-5" />
          <span className="font-medium">Admin Access</span>
        </div>
      </div>
      
      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="bg-gray-900/50 border border-gray-800/50">
          <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-gray-800">
            <ListFilter className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-gray-800">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="pt-6">
          {loading || !stats ? (
            renderLoadingSkeleton()
          ) : (
            <div className="admin-panel">
              <AdminKPI stats={stats} />
              <ActivityTimeline events={timeline} />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="users" className="pt-6">
          <UserTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage; 