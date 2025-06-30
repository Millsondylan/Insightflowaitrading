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
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { preferences, updatePreferences, changeLanguage } = useUserPreferences();
  
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

  // Update settings with user preferences when they load
  useEffect(() => {
    if (!loading && preferences) {
      setSettings((prevSettings: Partial<UserSettings>) => ({
        ...prevSettings,
        language: preferences.language
      }));
    }
  }, [preferences, loading]);

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
    key: keyof UserSettings[T] | string, 
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const updateTopLevelSetting = (
    key: keyof UserSettings, 
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const updateToggle = (
    section: 'notification_channels' | 'notification_types' | 'feature_toggles', 
    key: string, 
    value: boolean
  ) => {
    setSettings((prev: Partial<UserSettings>) => {
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
      // Update language preference if it has changed
      if (settings.language && settings.language !== preferences.language) {
        await changeLanguage(settings.language);
      }
      
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"/>
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
            disabled={saving}>
            Reset to Defaults
          </Button>
          <Button onClick={saveSettings} 
            disabled={!hasChanges() || saving}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"/>
                Saving...
              </>
            ) : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto">
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2"/> Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="w-4 h-4 mr-2"/> Appearance
          </TabsTrigger>
          <TabsTrigger value="features">
            <Bot className="w-4 h-4 mr-2"/> Features
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Globe className="w-4 h-4 mr-2"/> Preferences
          </TabsTrigger>
          <TabsTrigger value="wallet">
            <Smartphone className="w-4 h-4 mr-2"/> Wallet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          {/* Notification Channels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2 text-blue-400"/>
                Notification Channels
              </CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400"/>
                  <Label>Email Notifications</Label>
                </div>
                <Switch checked={settings.notification_channels?.email}
                  onCheckedChange={(checked) => updateToggle('notification_channels', 'email', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-gray-400"/>
                  <Label>Push Notifications</Label>
                </div>
                <Switch checked={settings.notification_channels?.push}
                  onCheckedChange={(checked) => updateToggle('notification_channels', 'push', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-gray-400"/>
                  <Label>In-App Alerts</Label>
                </div>
                <Switch checked={settings.notification_channels?.in_app}
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
                <Label>Trade Alerts</Label>
                <Switch checked={settings.notification_types?.trade_alerts}
                  onCheckedChange={(checked) => updateToggle('notification_types', 'trade_alerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Market Updates</Label>
                <Switch checked={settings.notification_types?.market_updates}
                  onCheckedChange={(checked) => updateToggle('notification_types', 'market_updates', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Strategy Signals</Label>
                <Switch checked={settings.notification_types?.strategy_signals}
                  onCheckedChange={(checked) => updateToggle('notification_types', 'strategy_signals', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Journal Reminders</Label>
                <Switch checked={settings.notification_types?.journal_reminders}
                  onCheckedChange={(checked) => updateToggle('notification_types', 'journal_reminders', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Goal Progress</Label>
                <Switch checked={settings.notification_types?.goal_progress}
                  onCheckedChange={(checked) => updateToggle('notification_types', 'goal_progress', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Course Updates</Label>
                <Switch checked={settings.notification_types?.course_updates}
                  onCheckedChange={(checked) => updateToggle('notification_types', 'course_updates', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Community Mentions</Label>
                <Switch checked={settings.notification_types?.community_mentions}
                  onCheckedChange={(checked) => updateToggle('notification_types', 'community_mentions', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-400"/>
                Quiet Hours
              </CardTitle>
              <CardDescription>
                Set when you don't want to be disturbed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Quiet Hours</Label>
                <Switch checked={settings.quiet_hours?.enabled}
                  onCheckedChange={(checked) => updateSetting('quiet_hours', 'enabled', checked)}
                />
              </div>
              
              {settings.quiet_hours?.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input type="time"
                      value={settings.quiet_hours?.start}
                      onChange={(e) => updateSetting('quiet_hours', 'start', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input type="time"
                      value={settings.quiet_hours?.end}
                      onChange={(e) => updateSetting('quiet_hours', 'end', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Timezone</Label>
                    <Select value={settings.quiet_hours?.timezone}
                      onValueChange={(value) => updateSetting('quiet_hours', 'timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone"/>
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
                <AlertCircle className="h-4 w-4"/>
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
                <Palette className="w-5 h-5 mr-2 text-blue-400"/>
                Theme Settings
              </CardTitle>
              <CardDescription>
                Customize the appearance of the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Theme Mode</Label>
                <RadioGroup value={settings.theme_preferences?.mode || "dark"}
                  onValueChange={(value) => updateSetting('theme_preferences', 'mode', value)}
                  className="flex items-center space-x-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark"/>
                    <Label htmlFor="dark" className="flex items-center">
                      <Moon className="w-4 h-4 mr-2"/> Dark
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light"/>
                    <Label htmlFor="light" className="flex items-center">
                      <Sun className="w-4 h-4 mr-2"/> Light
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label>Accent Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="color"
                    value={settings.theme_preferences?.accent_color || "#3B82F6"}
                    onChange={(e) => updateSetting('theme_preferences', 'accent_color', e.target.value)}
                    className="w-16 h-10"
                  />
                  <span className="text-sm text-gray-400">
                    {settings.theme_preferences?.accent_color || "#3B82F6"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Chart Theme</Label>
                <Select value={settings.theme_preferences?.chart_theme || "tradingview"}
                  onValueChange={(value) => updateSetting('theme_preferences', 'chart_theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select chart theme"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tradingview">TradingView</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Layout Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layout className="w-5 h-5 mr-2 text-blue-400"/>
                Layout Settings
              </CardTitle>
              <CardDescription>
                Customize the layout and navigation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Collapse Sidebar by Default</Label>
                <Switch checked={settings.layout_preferences?.sidebar_collapsed}
                  onCheckedChange={(checked) => updateSetting('layout_preferences', 'sidebar_collapsed', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Default View</Label>
                <Select value={settings.layout_preferences?.default_view || "dashboard"}
                  onValueChange={(value) => updateSetting('layout_preferences', 'default_view', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select default view"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                    <SelectItem value="markets">Markets</SelectItem>
                    <SelectItem value="portfolio">Portfolio</SelectItem>
                    <SelectItem value="journal">Journal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          {/* Feature Toggles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="w-5 h-5 mr-2 text-blue-400"/>
                Feature Toggles
              </CardTitle>
              <CardDescription>
                Enable or disable platform features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-gray-400"/>
                  <Label>AI Copilot</Label>
                </div>
                <Switch checked={settings.feature_toggles?.ai_copilot}
                  onCheckedChange={(checked) => updateToggle('feature_toggles', 'ai_copilot', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-gray-400"/>
                  <Label>Auto Journaling</Label>
                </div>
                <Switch checked={settings.feature_toggles?.auto_journaling}
                  onCheckedChange={(checked) => updateToggle('feature_toggles', 'auto_journaling', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-gray-400"/>
                  <Label>Smart Notifications</Label>
                </div>
                <Switch checked={settings.feature_toggles?.smart_notifications}
                  onCheckedChange={(checked) => updateToggle('feature_toggles', 'smart_notifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-gray-400"/>
                  <Label>Voice Narration</Label>
                </div>
                <Switch checked={settings.feature_toggles?.voice_narration}
                  onCheckedChange={(checked) => updateToggle('feature_toggles', 'voice_narration', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Keyboard className="w-4 h-4 text-gray-400"/>
                  <Label>Keyboard Shortcuts</Label>
                </div>
                <Switch checked={settings.feature_toggles?.keyboard_shortcuts}
                  onCheckedChange={(checked) => updateToggle('feature_toggles', 'keyboard_shortcuts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-gray-400"/>
                  <Label>Beta Features</Label>
                </div>
                <Switch checked={settings.feature_toggles?.beta_features}
                  onCheckedChange={(checked) => updateToggle('feature_toggles', 'beta_features', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Audio Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Volume2 className="w-5 h-5 mr-2 text-blue-400"/>
                Audio Settings
              </CardTitle>
              <CardDescription>
                Configure audio notifications and sounds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Sounds</Label>
                <Switch checked={settings.audio_settings?.sounds_enabled}
                  onCheckedChange={(checked) => updateSetting('audio_settings', 'sounds_enabled', checked)}
                />
              </div>
              
              {settings.audio_settings?.sounds_enabled && (
                <div className="space-y-2">
                  <Label>Volume: {settings.audio_settings?.volume || 80}%</Label>
                  <Slider
                    value={[settings.audio_settings?.volume || 80]}
                    onValueChange={(value) => updateSetting('audio_settings', 'volume', value[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          {/* Language and Region */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-400"/>
                Language & Region
              </CardTitle>
              <CardDescription>
                Set your preferred language and regional settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={settings.language || "en"}
                  onValueChange={(value) => updateTopLevelSetting('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Coaching Tone</Label>
                <Select value={settings.coaching_tone || "balanced"}
                  onValueChange={(value) => updateTopLevelSetting('coaching_tone', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select coaching tone"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="encouraging">Encouraging</SelectItem>
                    <SelectItem value="strict">Strict</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Reminder Frequency</Label>
                <Select value={settings.reminder_frequency || "daily"}
                  onValueChange={(value) => updateTopLevelSetting('reminder_frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reminder frequency"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-6">
          {/* Wallet Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="w-5 h-5 mr-2 text-blue-400"/>
                Wallet Settings
              </CardTitle>
              <CardDescription>
                Manage your wallet and payment preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4"/>
                <AlertTitle>Wallet Management</AlertTitle>
                <AlertDescription>
                  Wallet settings are managed in the dedicated wallet section. 
                  <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/wallet')}>
                    Go to Wallet
                  </Button>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 