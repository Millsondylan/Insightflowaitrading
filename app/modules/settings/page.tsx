'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  Shield,
  Bell,
  Palette,
  Globe,
  Database,
  Zap,
  Key,
  Link,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Save,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Download
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  type: 'broker' | 'data' | 'notification' | 'ai';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
  description: string;
  icon: string;
}

interface NotificationSetting {
  id: string;
  type: string;
  email: boolean;
  push: boolean;
  sms: boolean;
  description: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKeys, setShowApiKeys] = useState(false);

  // Mock data - in real app this would come from Supabase
  const integrations: Integration[] = [
    {
      id: '1',
      name: 'Interactive Brokers',
      type: 'broker',
      status: 'connected',
      lastSync: new Date(Date.now() - 5 * 60 * 1000),
      description: 'Real-time trade execution and portfolio sync',
      icon: 'Database'
    },
    {
      id: '2',
      name: 'Alpaca Markets',
      type: 'broker',
      status: 'connected',
      lastSync: new Date(Date.now() - 10 * 60 * 1000),
      description: 'Commission-free trading and market data',
      icon: 'Database'
    },
    {
      id: '3',
      name: 'Alpha Vantage',
      type: 'data',
      status: 'connected',
      lastSync: new Date(Date.now() - 2 * 60 * 1000),
      description: 'Real-time market data and technical indicators',
      icon: 'Zap'
    },
    {
      id: '4',
      name: 'OpenAI GPT-4',
      type: 'ai',
      status: 'connected',
      lastSync: new Date(Date.now() - 1 * 60 * 1000),
      description: 'AI-powered trading insights and analysis',
      icon: 'Zap'
    },
    {
      id: '5',
      name: 'Twilio SMS',
      type: 'notification',
      status: 'disconnected',
      description: 'SMS notifications for trade alerts',
      icon: 'Bell'
    }
  ];

  const notificationSettings: NotificationSetting[] = [
    {
      id: '1',
      type: 'Trade Executions',
      email: true,
      push: true,
      sms: false,
      description: 'Notifications when trades are executed'
    },
    {
      id: '2',
      type: 'Price Alerts',
      email: true,
      push: true,
      sms: true,
      description: 'Alerts when price targets are reached'
    },
    {
      id: '3',
      type: 'Risk Warnings',
      email: true,
      push: true,
      sms: false,
      description: 'Warnings when risk limits are exceeded'
    },
    {
      id: '4',
      type: 'AI Insights',
      email: false,
      push: true,
      sms: false,
      description: 'AI-generated trading insights and recommendations'
    }
  ];

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'integrations', name: 'Integrations', icon: Link },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'data', name: 'Data & Privacy', icon: Database }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'disconnected': return 'text-slate-400';
      case 'error': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'disconnected': return <Clock className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'integrations':
        return <IntegrationsSettings integrations={integrations} />;
      case 'notifications':
        return <NotificationSettings notifications={notificationSettings} />;
      case 'security':
        return <SecuritySettings showApiKeys={showApiKeys} setShowApiKeys={setShowApiKeys} />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'data':
        return <DataSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <Settings className="h-8 w-8 text-blue-400 mr-3" />
              Settings & Configuration
            </h1>
            <p className="text-slate-300">Manage your platform settings and integrations</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/modules/settings/backup')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <Database className="h-4 w-4 mr-2" />
              Backup Data
            </button>
            <button
              onClick={() => router.push('/modules/settings/export')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Export Settings
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <nav className="space-y-2">
                {tabs.map(tab => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Display Name</label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <input
              type="email"
              defaultValue="john@example.com"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Time Zone</label>
            <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>UTC-5 (Eastern Time)</option>
              <option>UTC-8 (Pacific Time)</option>
              <option>UTC+0 (GMT)</option>
              <option>UTC+1 (Central European Time)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Currency</label>
            <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>JPY (¥)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationsSettings({ integrations }: { integrations: Integration[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Integrations</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium flex items-center transition-colors">
            <Plus className="h-4 w-4 mr-1" />
            Add Integration
          </button>
        </div>
        <div className="space-y-4">
          {integrations.map(integration => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </div>
      </div>
    </div>
  );
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'disconnected': return 'text-slate-400';
      case 'error': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'disconnected': return <Clock className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <Database className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-medium">{integration.name}</h3>
          <p className="text-slate-400 text-sm">{integration.description}</p>
          {integration.lastSync && (
            <p className="text-slate-500 text-xs">
              Last sync: {integration.lastSync.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-1 ${getStatusColor(integration.status)}`}>
          {getStatusIcon(integration.status)}
          <span className="text-sm capitalize">{integration.status}</span>
        </div>
        <button className="p-2 hover:bg-slate-600 rounded transition-colors">
          <RefreshCw className="h-4 w-4 text-blue-400" />
        </button>
        <button className="p-2 hover:bg-slate-600 rounded transition-colors">
          <Settings className="h-4 w-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
}

function NotificationSettings({ notifications }: { notifications: NotificationSetting[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          {notifications.map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationCard({ notification }: { notification: NotificationSetting }) {
  return (
    <div className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-medium">{notification.type}</h3>
      </div>
      <p className="text-slate-400 text-sm mb-3">{notification.description}</p>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={notification.email} className="rounded" />
          <span className="text-slate-300 text-sm">Email</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={notification.push} className="rounded" />
          <span className="text-slate-300 text-sm">Push</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={notification.sms} className="rounded" />
          <span className="text-slate-300 text-sm">SMS</span>
        </label>
      </div>
    </div>
  );
}

function SecuritySettings({ showApiKeys, setShowApiKeys }: { showApiKeys: boolean; setShowApiKeys: (show: boolean) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Security Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Current Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
            Update Password
          </button>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">API Keys</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">OpenAI API Key</h3>
              <p className="text-slate-400 text-sm">Used for AI-powered features</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type={showApiKeys ? 'text' : 'password'}
                defaultValue="sk-...abc123"
                className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
              />
              <button
                onClick={() => setShowApiKeys(!showApiKeys)}
                className="p-1 hover:bg-slate-600 rounded"
              >
                {showApiKeys ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Alpaca API Key</h3>
              <p className="text-slate-400 text-sm">Used for trading and market data</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type={showApiKeys ? 'text' : 'password'}
                defaultValue="PK...xyz789"
                className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
              />
              <button
                onClick={() => setShowApiKeys(!showApiKeys)}
                className="p-1 hover:bg-slate-600 rounded"
              >
                {showApiKeys ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Appearance Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Theme</label>
            <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Dark (Default)</option>
              <option>Light</option>
              <option>Auto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Accent Color</label>
            <div className="flex gap-2">
              {['blue', 'purple', 'green', 'red', 'yellow'].map(color => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 ${
                    color === 'blue' ? 'border-blue-500' : 'border-slate-600'
                  }`}
                  style={{ backgroundColor: color }}
                ></button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Chart Style</label>
            <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Candlestick</option>
              <option>Line</option>
              <option>Bar</option>
              <option>Area</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataSettings() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Data & Privacy</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Data Collection</h3>
              <p className="text-slate-400 text-sm">Allow us to collect usage data to improve the platform</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Analytics</h3>
              <p className="text-slate-400 text-sm">Share anonymous analytics data</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Marketing Communications</h3>
              <p className="text-slate-400 text-sm">Receive updates about new features and promotions</p>
            </div>
            <input type="checkbox" className="rounded" />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Data Management</h2>
        <div className="space-y-4">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export My Data
          </button>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center transition-colors">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
} 