import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { getUserSettings, updateUserSettings, UserSettings } from '@/lib/db/userSettings';
import { useAuditLog } from '@/lib/monitoring/auditLogger';
import {
  AlertCircle,
  Bell,
  Clock,
  Mail,
  Smartphone,
  Globe,
  Palette,
  Moon,
  Sun,
  Layout,
  BarChart3,
  Bot,
  Keyboard,
  MessageSquare,
  Volume2
} from 'lucide-react';

const DEFAULT_SETTINGS: Partial<UserSettings> = {
  notification_channels: {
    email: true,
    push: true,
    in_app: true,
  },
  notification_types: {
    trade_alerts: true,
    market_updates: true,
    strategy_signals: true,
    journal_reminders: true,
    goal_progress: true,
    course_updates: true,
    community_mentions: true,
  },
  quiet_hours: {
    enabled: false,
    start: "22:00",
    end: "08:00",
    timezone: "UTC",
  },
  theme_preferences: {
    mode: "dark",
    accent_color: "#3B82F6",
    chart_theme: "tradingview",
  },
  layout_preferences: {
    sidebar_collapsed: false,
    default_view: "dashboard",
  },
  chart_settings: {},
  feature_toggles: {
    ai_copilot: true,
    auto_journaling: false,
    smart_notifications: true,
    voice_narration: false,
    keyboard_shortcuts: true,
    beta_features: false,
  },
  audio_settings: {
    sounds_enabled: false,
    volume: 80,
  },
  coaching_tone: "balanced",
  reminder_frequency: "daily",
  language: "en",
};

export default function UserSettingsPage() {
  const { user } = useAuth();
  const { logClick, logFormSubmit } = useAuditLog();
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState<Partial<UserSettings>>(DEFAULT_SETTINGS);
  const [originalSettings, setOriginalSettings] = useState<Partial<UserSettings>>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("notifications");

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadUserSettings();
  }, [user]);

  const loadUserSettings = async () => {
    setLoading(true);
    try {
      const userSettings = await getUserSettings(user!.id);
      if (userSettings) {
        setSettings(userSettings);
        setOriginalSettings(userSettings);
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
      toast({
        title: "Error Loading Settings",
        description: "We couldn't load your settings. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = () => {
    return JSON.stringify(settings) !== JSON.stringify(originalSettings);
  };

  const updateSetting = <T extends keyof UserSettings>(
    section: T, 
    key: keyof UserSettings[T], 
    value: any
  ) => {
    setSettings(prev => {
      const prevSection = prev[section] as any || {};
      return {
        ...prev,
        [section]: {
          ...prevSection,
          [key]: value,
        }
      };
    });
    
    logClick('UpdateSetting', { section, key, value });
  };

  const updateToggle = (
    section: 'notification_channels' | 'notification_types' | 'feature_toggles', 
    key: string, 
    value: boolean
  ) => {
    setSettings(prev => {
      const prevSection = prev[section] as any || {};
      return {
        ...prev,
        [section]: {
          ...prevSection,
          [key]: value,
        }
      };
    });
    
    logClick('ToggleSetting', { section, key, value });
  };

  const saveSettings = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const updated = await updateUserSettings(user.id, settings);
      if (updated) {
        setOriginalSettings(settings);
        toast({
          title: "Settings Saved",
          description: "Your preferences have been updated successfully.",
        });
        
        logFormSubmit('UserSettings', { settings });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error Saving Settings",
        description: "We couldn't save your settings. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    logClick('ResetSettingsToDefault');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Customize your trading platform experience</p>
        </div>
        <div className="space-x-4">
          <Button variant="outline" 
            onClick={resetToDefaults}
            disabled={saving}
         >
            Reset to Defaults
          </Button>
          <Button onClick={saveSettings} 
            disabled={!hasChanges() || saving}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs 
        defaultValue={activeTab} 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="w-4 h-4 mr-2" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="features">
            <Bot className="w-4 h-4 mr-2" /> Features
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Globe className="w-4 h-4 mr-2" /> Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          {/* Notification Channels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2 text-blue-400" />
                Notification Channels
              </CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <label>Email Notifications</label>
                </div>
                <Switch
                  checked={settings.notification_channels?.email}
                  onCheckedChange={(checked) => updateToggle('notification_channels', 'email', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-gray-400" />
                  <label>Push Notifications</label>
                </div>
                <Switch
                  checked={settings.notification_channels?.push}
                  onCheckedChange={(checked) => updateToggle('notification_channels', 'push', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                  <label>In-App Alerts</label>
                </div>
                <Switch
                  checked={settings.notification_channels?.in_app}
                  onCheckedChange={(checked) => updateToggle('notification_channels', 'in_app', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Types */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Types</CardTitle>
              <CardDescription>
                Select which types of notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <label>Trade Alerts</label>
                <Switch
                  checked={settings.notification_types?.trade_alerts}
                  onCheckedChange={(checked) => updateToggle('notification_types', 'trade_alerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Market Updates</label>
                <Switch
                  checked={settings.notification_types?.market_updates}
                  onCheckedChange={(checked) => updateToggle('notification_types', 'market_updates', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Strategy Signals</label>
                <Switch
                  checked={settings.notification_types?.strategy_signals}
                  onCheckedChange={(checked) => updateToggle('notification_types', 'strategy_signals', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Journal Reminders</label>
                <Switch
                  checked={settings.notification_types?.journal_reminders}
                  onCheckedChange={(checked) => updateToggle('notification_types', 'journal_reminders', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Goal Progress</label>
                <Switch
                  checked={settings.notification_types?.goal_progress}
                  onCheckedChange={(checked) => updateToggle('notification_types', 'goal_progress', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Course Updates</label>
                <Switch
                  checked={settings.notification_types?.course_updates}
                  onCheckedChange={(checked) => updateToggle('notification_types', 'course_updates', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Community Mentions</label>
                <Switch
                  checked={settings.notification_types?.community_mentions}
                  onCheckedChange={(checked) => updateToggle('notification_types', 'community_mentions', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                Quiet Hours
              </CardTitle>
              <CardDescription>
                Set when you don't want to be disturbed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label>Enable Quiet Hours</label>
                <Switch
                  checked={settings.quiet_hours?.enabled}
                  onCheckedChange={(checked) => updateSetting('quiet_hours', 'enabled', checked)}
                />
              </div>
              
              {settings.quiet_hours?.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <label>Start Time</label>
                    <input type="time"
                      value={settings.quiet_hours?.start}
                      onChange={(e) => updateSetting('quiet_hours', 'start', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label>End Time</label>
                    <input type="time"
                      value={settings.quiet_hours?.end}
                      onChange={(e) => updateSetting('quiet_hours', 'end', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label>Timezone</label>
                    <Select
                      value={settings.quiet_hours?.timezone}
                      onValueChange={(value) => updateSetting('quiet_hours', 'timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              <Alert variant="default" className="bg-blue-600/10 text-blue-400 border-blue-600/30">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  During quiet hours, you'll still receive urgent notifications like major price alerts.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2 text-blue-400" />
                Theme Settings
              </CardTitle>
              <CardDescription>
                Customize the appearance of the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <label>Theme Mode</label>
                <RadioGroup
                  value={settings.theme_preferences?.mode || "dark"}
                  onValueChange={(value) => updateSetting('theme_preferences', 'mode', value)}
                  className="flex items-center space-x-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <label htmlFor="dark" className="flex items-center">
                      <Moon className="w-4 h-4 mr-2" /> Dark
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <label htmlFor="light" className="flex items-center">
                      <Sun className="w-4 h-4 mr-2" /> Light
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <label htmlFor="system" className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" /> System
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <label>Accent Color</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "Blue", value: "#3B82F6" },
                    { label: "Purple", value: "#8B5CF6" },
                    { label: "Green", value: "#10B981" },
                    { label: "Red", value: "#EF4444" },
                    { label: "Orange", value: "#F59E0B" },
                    { label: "Pink", value: "#EC4899" },
                  ].map((color) => (
                    <Button key={color.value}
                      variant={settings.theme_preferences?.accent_color === color.value ? "default" : "outline"}
                      className="w-10 h-10 p-0 rounded-full"
                      style={{ backgroundColor: settings.theme_preferences?.accent_color === color.value ? color.value : "transparent" }}
                      onClick={() => updateSetting('theme_preferences', 'accent_color', color.value)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label>Chart Theme</label>
                <Select
                  value={settings.theme_preferences?.chart_theme}
                  onValueChange={(value) => updateSetting('theme_preferences', 'chart_theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select chart theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tradingview">TradingView</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Layout Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layout className="w-5 h-5 mr-2 text-blue-400" />
                Layout Preferences
              </CardTitle>
              <CardDescription>
                Configure how the interface is organized
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label>Collapse Sidebar by Default</label>
                <Switch
                  checked={settings.layout_preferences?.sidebar_collapsed}
                  onCheckedChange={(checked) => updateSetting('layout_preferences', 'sidebar_collapsed', checked)}
                />
              </div>

              <div className="space-y-2">
                <label>Default View</label>
                <Select
                  value={settings.layout_preferences?.default_view}
                  onValueChange={(value) => updateSetting('layout_preferences', 'default_view', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select default view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                    <SelectItem value="markets">Markets</SelectItem>
                    <SelectItem value="journal">Journal</SelectItem>
                    <SelectItem value="academy">Academy</SelectItem>
                    <SelectItem value="portfolio">Portfolio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Chart Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                Chart Settings
              </CardTitle>
              <CardDescription>
                Configure default chart display options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label>Default Timeframe</label>
                  <Select
                    value={settings.chart_settings?.default_timeframe || "1h"}
                    onValueChange={(value) => updateSetting('chart_settings', 'default_timeframe', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">1 Minute</SelectItem>
                      <SelectItem value="5m">5 Minutes</SelectItem>
                      <SelectItem value="15m">15 Minutes</SelectItem>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="4h">4 Hours</SelectItem>
                      <SelectItem value="1d">Daily</SelectItem>
                      <SelectItem value="1w">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label>Chart Style</label>
                  <Select
                    value={settings.chart_settings?.style || "candles"}
                    onValueChange={(value) => updateSetting('chart_settings', 'style', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select chart style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="candles">Candlesticks</SelectItem>
                      <SelectItem value="bars">Bars</SelectItem>
                      <SelectItem value="line">Line</SelectItem>
                      <SelectItem value="heikin-ashi">Heikin Ashi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          {/* AI and Automation Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="w-5 h-5 mr-2 text-blue-400" />
                AI and Automation
              </CardTitle>
              <CardDescription>
                Configure intelligent features that enhance your trading
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label>AI Copilot</label>
                  <p className="text-sm text-gray-400">Get intelligent suggestions as you trade</p>
                </div>
                <Switch
                  checked={settings.feature_toggles?.ai_copilot}
                  onCheckedChange={(checked) => updateToggle('feature_toggles', 'ai_copilot', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <label>Automated Journaling</label>
                  <p className="text-sm text-gray-400">Automatically generate trade journals</p>
                </div>
                <Switch
                  checked={settings.feature_toggles?.auto_journaling}
                  onCheckedChange={(checked) => updateToggle('feature_toggles', 'auto_journaling', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <label>Smart Notifications</label>
                  <p className="text-sm text-gray-400">AI-powered alerts based on your activity</p>
                </div>
                <Switch
                  checked={settings.feature_toggles?.smart_notifications}
                  onCheckedChange={(checked) => updateToggle('feature_toggles', 'smart_notifications', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <label>Voice Narration</label>
                  <p className="text-sm text-gray-400">Listen to AI-generated commentary</p>
                </div>
                <Switch
                  checked={settings.feature_toggles?.voice_narration}
                  onCheckedChange={(checked) => updateToggle('feature_toggles', 'voice_narration', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Advanced Features */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Features</CardTitle>
              <CardDescription>
                Configure additional platform capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label>Keyboard Shortcuts</label>
                  <p className="text-sm text-gray-400">Enable hotkeys for faster navigation</p>
                </div>
                <Switch
                  checked={settings.feature_toggles?.keyboard_shortcuts}
                  onCheckedChange={(checked) => updateToggle('feature_toggles', 'keyboard_shortcuts', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <label>Beta Features</label>
                  <p className="text-sm text-gray-400">Try experimental features before they're released</p>
                </div>
                <Switch
                  checked={settings.feature_toggles?.beta_features}
                  onCheckedChange={(checked) => updateToggle('feature_toggles', 'beta_features', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          {/* AI Coaching */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
                AI Coaching Style
              </CardTitle>
              <CardDescription>
                Choose how the AI coach interacts with you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={settings.coaching_tone || "balanced"}
                onValueChange={(value) => setSettings({ ...settings, coaching_tone: value as any })}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="supportive" id="supportive" />
                  <label htmlFor="supportive" className="font-medium">Supportive</label>
                  <p className="text-sm text-gray-400 ml-2">Focuses on encouragement and positive reinforcement</p>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="balanced" id="balanced" />
                  <label htmlFor="balanced" className="font-medium">Balanced</label>
                  <p className="text-sm text-gray-400 ml-2">Provides a mix of encouragement and constructive feedback</p>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="challenging" id="challenging" />
                  <label htmlFor="challenging" className="font-medium">Challenging</label>
                  <p className="text-sm text-gray-400 ml-2">Pushes you with direct feedback and high expectations</p>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="analytical" id="analytical" />
                  <label htmlFor="analytical" className="font-medium">Analytical</label>
                  <p className="text-sm text-gray-400 ml-2">Focuses on data, metrics, and objective analysis</p>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                Reminder Frequency
              </CardTitle>
              <CardDescription>
                How often would you like to receive coaching reminders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={settings.reminder_frequency || "daily"}
                onValueChange={(value) => setSettings({ ...settings, reminder_frequency: value as any })}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="hourly" id="hourly" />
                  <label htmlFor="hourly">Hourly</label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="daily" id="daily" />
                  <label htmlFor="daily">Daily</label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <label htmlFor="weekly">Weekly</label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="custom" id="custom" />
                  <label htmlFor="custom">Custom</label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Language */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-400" />
                Language & Region
              </CardTitle>
              <CardDescription>
                Choose your preferred language and region settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label>Language</label>
                <Select
                  value={settings.language || "en"}
                  onValueChange={(value) => setSettings({ ...settings, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Audio Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Volume2 className="w-5 h-5 mr-2 text-blue-400" />
                Audio Settings
              </CardTitle>
              <CardDescription>
                Configure sound effects and voice narration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label>Enable Sound Effects</label>
                  <Switch
                    checked={settings.audio_settings?.sounds_enabled || false}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings,
                        audio_settings: {
                          ...settings.audio_settings,
                          sounds_enabled: checked
                        }
                      })
                    }
                  />
                </div>
                {settings.audio_settings?.sounds_enabled && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label>Sound Volume</label>
                        <span className="text-sm text-gray-400">
                          {settings.audio_settings?.volume || 80}%
                        </span>
                      </div>
                      <Slider
                        value={[settings.audio_settings?.volume || 80]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) =>
                          setSettings({
                            ...settings,
                            audio_settings: {
                              ...settings.audio_settings,
                              volume: value[0]
                            }
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {hasChanges() && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/90 backdrop-blur-sm border-t border-gray-800 flex items-center justify-center z-10">
          <div className="flex items-center gap-4">
            <p className="text-white">You have unsaved changes</p>
            <button onClick={saveSettings} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Button variant="outline" 
              onClick={() => setSettings(originalSettings)}
            >
              Discard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 