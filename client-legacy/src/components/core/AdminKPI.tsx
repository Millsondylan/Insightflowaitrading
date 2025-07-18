import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { Users, Bot, BookOpen, Image as ImageIcon } from 'lucide-react';
import { DashboardStats } from '@/lib/admin/fetchDashboardStats';
import { cn } from '@/lib/utils';
import '@/styles/admin.css';

interface AdminKPIProps {
  stats: DashboardStats;
}

const kpiItems = [
  { key: 'totalUsers', title: 'Total Users', icon: Users, color: 'cyan' },
  { key: 'strategyBuilds', title: 'Strategy Builds', icon: Bot, color: 'violet' },
  { key: 'journalsSaved', title: 'Journals Saved', icon: BookOpen, color: 'amber' },
  { key: 'chartsUploaded', title: 'Charts Uploaded', icon: ImageIcon, color: 'emerald' },
];

const AdminKPI: React.FC<AdminKPIProps> = ({ stats }) => {
  return (
    <div className="kpi-grid">
      {kpiItems.map((item, index) => {
        const Icon = item.icon;
        const value = stats[item.key as keyof DashboardStats];

        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn('kpi-card', `glow-${item.color}`)}
          >
            <Icon className={cn('kpi-icon', `text-${item.color}-500`)}/>
            <div className="kpi-title">{item.title}</div>
            <div className="kpi-value">
              <CountUp end={value} duration={2.5} separator=","/>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AdminKPI;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 