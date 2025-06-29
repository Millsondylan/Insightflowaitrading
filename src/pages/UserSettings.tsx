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
      setSettings(prevSettings => ({
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

  const updateSetting = <T extends keyof UserSettings />(
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
      <Div className="flex items-center justify-center h-screen">
        <Div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></UserSettings>
      </Div>
    );
  }

  return (
    <Div className="container max-w-6xl mx-auto py-8">
      <Div className="flex items-center justify-between mb-8">
        <Div>
          <H1 className="text-3xl font-bold text-white">Settings</Div>
          <P className="text-gray-400">Customize your trading platform experience</P>
        </Div>
        <Div className="space-x-4">
          <Button variant="outline" 
            onClick={resetToDefaults}
            disabled={saving}
       >
            Reset to Defaults
          </Div>
          <Button onClick={saveSettings} 
            disabled={!hasChanges() || saving}
        >
            {saving ? (
              <>
                <Div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></Button>
                Saving...
              </>
            ) : "Save Changes"}
          </Button>
        </Div>
      </Div>

      <Tabs defaultValue={activeTab} 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
    >
        <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto" />
          <TabsTrigger value="notifications" />
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </Tabs>
          <TabsTrigger value="appearance" />
            <Palette className="w-4 h-4 mr-2" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="features" />
            <Bot className="w-4 h-4 mr-2" /> Features
          </TabsTrigger>
          <TabsTrigger value="preferences" />
            <Globe className="w-4 h-4 mr-2" /> Preferences
          </TabsTrigger>
          <TabsTrigger value="wallet" />
            <Smartphone className="w-4 h-4 mr-2" /> Wallet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6" />
          {/* Notification Channels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center" />
                <Bell className="w-5 h-5 mr-2 text-blue-400" />
                Notification Channels
              </TabsContent>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" />
              <Div className="flex items-center justify-between">
                <Div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <Label>Email Notifications</CardContent>
                </Div>
                <Switch checked={settings.notification_channels?.email}
                  onCheckedChange={(checked) = /> updateToggle('notification_channels', 'email', checked)}
                />
              </Switch>
              <Div className="flex items-center justify-between">
                <Div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-gray-400" />
                  <Label>Push Notifications</Div>
                </Div>
                <Switch checked={settings.notification_channels?.push}
                  onCheckedChange={(checked) = /> updateToggle('notification_channels', 'push', checked)}
                />
              </Switch>
              <Div className="flex items-center justify-between">
                <Div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                  <Label>In-App Alerts</Div>
                </Div>
                <Switch checked={settings.notification_channels?.in_app}
                  onCheckedChange={(checked) = /> updateToggle('notification_channels', 'in_app', checked)}
                />
              </Switch>
            </CardContent>
          </Card>

          {/* Notification Types */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Types</Card>
              <CardDescription>
                Select which types of notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4" />
              <Div className="flex items-center justify-between">
                <Label>Trade Alerts</CardContent>
                <Switch checked={settings.notification_types?.trade_alerts}
                  onCheckedChange={(checked) = /> updateToggle('notification_types', 'trade_alerts', checked)}
                />
              </Switch>
              <Div className="flex items-center justify-between">
                <Label>Market Updates</Div>
                <Switch checked={settings.notification_types?.market_updates}
                  onCheckedChange={(checked) = /> updateToggle('notification_types', 'market_updates', checked)}
                />
              </Switch>
              <Div className="flex items-center justify-between">
                <Label>Strategy Signals</Div>
                <Switch checked={settings.notification_types?.strategy_signals}
                  onCheckedChange={(checked) = /> updateToggle('notification_types', 'strategy_signals', checked)}
                />
              </Switch>
              <Div className="flex items-center justify-between">
                <Label>Journal Reminders</Div>
                <Switch checked={settings.notification_types?.journal_reminders}
                  onCheckedChange={(checked) = /> updateToggle('notification_types', 'journal_reminders', checked)}
                />
              </Switch>
              <Div className="flex items-center justify-between">
                <Label>Goal Progress</Div>
                <Switch checked={settings.notification_types?.goal_progress}
                  onCheckedChange={(checked) = /> updateToggle('notification_types', 'goal_progress', checked)}
                />
              </Switch>
              <Div className="flex items-center justify-between">
                <Label>Course Updates</Div>
                <Switch checked={settings.notification_types?.course_updates}
                  onCheckedChange={(checked) = /> updateToggle('notification_types', 'course_updates', checked)}
                />
              </Switch>
              <Div className="flex items-center justify-between">
                <Label>Community Mentions</Div>
                <Switch checked={settings.notification_types?.community_mentions}
                  onCheckedChange={(checked) = /> updateToggle('notification_types', 'community_mentions', checked)}
                />
              </Switch>
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center" />
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                Quiet Hours
              </Card>
              <CardDescription>
                Set when you don't want to be disturbed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" />
              <Div className="flex items-center justify-between">
                <Label>Enable Quiet Hours</CardContent>
                <Switch checked={settings.quiet_hours?.enabled}
                  onCheckedChange={(checked) = /> updateSetting('quiet_hours', 'enabled', checked)}
                />
              </Switch>
              
              {settings.quiet_hours?.enabled && (
                <Div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Div className="space-y-2">
                    <Label>Start Time</Div>
                    <Input type="time"
                      value={settings.quiet_hours?.start}
                      onChange={(e) => updateSetting('quiet_hours', 'start', e.target.value)}
                    />
                  </Input>
                  <Div className="space-y-2">
                    <Label>End Time</Div>
                    <Input type="time"
                      value={settings.quiet_hours?.end}
                      onChange={(e) => updateSetting('quiet_hours', 'end', e.target.value)}
                    />
                  </Input>
                  <Div className="space-y-2 md:col-span-2">
                    <Label>Timezone</Div>
                    <Select value={settings.quiet_hours?.timezone}
                      onValueChange={(value) = /> updateSetting('quiet_hours', 'timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </Select>
                      <SelectContent>
                        <SelectItem value="UTC" />UTC</SelectContent>
                        <SelectItem value="America/New_York" />Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago" />Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver" />Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles" />Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London" />London (GMT)</SelectItem>
                        <SelectItem value="Asia/Tokyo" />Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </Div>
                </Div>
              )}
              
              <Alert variant="default" className="bg-blue-600/10 text-blue-400 border-blue-600/30" />
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</Alert>
                <AlertDescription>
                  During quiet hours, you'll still receive urgent notifications like major price alerts.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6" />
          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center" />
                <Palette className="w-5 h-5 mr-2 text-blue-400" />
                Theme Settings
              </TabsContent>
              <CardDescription>
                Customize the appearance of the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6" />
              <Div className="space-y-4">
                <Label>Theme Mode</CardContent>
                <RadioGroup value={settings.theme_preferences?.mode || "dark"}
                  onValueChange={(value) = /> updateSetting('theme_preferences', 'mode', value)}
                  className="flex items-center space-x-2"
                >
                  <Div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex items-center">
                      <Moon className="w-4 h-4 mr-2" /> Dark
                    </RadioGroup>
                  </Div>
                  <Div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex items-center">
                      <Sun className="w-4 h-4 mr-2" /> Light
                    </Div>
                  </Div>
                  <Div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system" className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" /> System
                    </Div>
                  </Div>
                </RadioGroup>
              </Div>

              <Div className="space-y-4">
                <Label>Accent Color</Div>
                <Div className="flex flex-wrap gap-3">
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
                      onClick={() = /> updateSetting('theme_preferences', 'accent_color', color.value)}
                    />
                  ))}
                </Div>
              </Div>

              <Div className="space-y-4">
                <Label>Chart Theme</Div>
                <Select value={settings.theme_preferences?.chart_theme}
                  onValueChange={(value) = /> updateSetting('theme_preferences', 'chart_theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select chart theme" />
                  </Select>
                  <SelectContent>
                    <SelectItem value="tradingview" />TradingView</SelectContent>
                    <SelectItem value="dark" />Dark</SelectItem>
                    <SelectItem value="light" />Light</SelectItem>
                    <SelectItem value="custom" />Custom</SelectItem>
                  </SelectContent>
                </Select>
              </Div>
            </CardContent>
          </Card>

          {/* Layout Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center" />
                <Layout className="w-5 h-5 mr-2 text-blue-400" />
                Layout Preferences
              </Card>
              <CardDescription>
                Configure how the interface is organized
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" />
              <Div className="flex items-center justify-between">
                <Label>Collapse Sidebar by Default</CardContent>
                <Switch checked={settings.layout_preferences?.sidebar_collapsed}
                  onCheckedChange={(checked) = /> updateSetting('layout_preferences', 'sidebar_collapsed', checked)}
                />
              </Switch>

              <Div className="space-y-2">
                <Label>Default View</Div>
                <Select value={settings.layout_preferences?.default_view}
                  onValueChange={(value) = /> updateSetting('layout_preferences', 'default_view', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select default view" />
                  </Select>
                  <SelectContent>
                    <SelectItem value="dashboard" />Dashboard</SelectContent>
                    <SelectItem value="markets" />Markets</SelectItem>
                    <SelectItem value="journal" />Journal</SelectItem>
                    <SelectItem value="academy" />Academy</SelectItem>
                    <SelectItem value="portfolio" />Portfolio</SelectItem>
                  </SelectContent>
                </Select>
              </Div>
            </CardContent>
          </Card>

          {/* Chart Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center" />
                <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                Chart Settings
              </Card>
              <CardDescription>
                Configure default chart display options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" />
              <Div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Div className="space-y-2">
                  <Label>Default Timeframe</CardContent>
                  <Select value={settings.chart_settings?.default_timeframe || "1h"}
                    onValueChange={(value) = /> updateSetting('chart_settings', 'default_timeframe', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </Select>
                    <SelectContent>
                      <SelectItem value="1m" />1 Minute</SelectContent>
                      <SelectItem value="5m" />5 Minutes</SelectItem>
                      <SelectItem value="15m" />15 Minutes</SelectItem>
                      <SelectItem value="1h" />1 Hour</SelectItem>
                      <SelectItem value="4h" />4 Hours</SelectItem>
                      <SelectItem value="1d" />Daily</SelectItem>
                      <SelectItem value="1w" />Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </Div>
                <Div className="space-y-2">
                  <Label>Chart Style</Div>
                  <Select value={settings.chart_settings?.style || "candles"}
                    onValueChange={(value) = /> updateSetting('chart_settings', 'style', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select chart style" />
                    </Select>
                    <SelectContent>
                      <SelectItem value="candles" />Candlesticks</SelectContent>
                      <SelectItem value="bars" />Bars</SelectItem>
                      <SelectItem value="line" />Line</SelectItem>
                      <SelectItem value="heikin-ashi" />Heikin Ashi</SelectItem>
                    </SelectContent>
                  </Select>
                </Div>
              </Div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6" />
          {/* AI and Automation Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center" />
                <Bot className="w-5 h-5 mr-2 text-blue-400" />
                AI and Automation
              </TabsContent>
              <CardDescription>
                Configure intelligent features that enhance your trading
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" />
              <Div className="flex items-center justify-between">
                <Div>
                  <Label>AI Copilot</CardContent>
                  <P className="text-sm text-gray-400">Get intelligent suggestions as you trade</P>
                </Div>
                <Switch checked={settings.feature_toggles?.ai_copilot}
                  onCheckedChange={(checked) = /> updateToggle('feature_toggles', 'ai_copilot', checked)}
                />
              </Switch>
              <Separator />
              <Div className="flex items-center justify-between">
                <Div>
                  <Label>Automated Journaling</Separator>
                  <P className="text-sm text-gray-400">Automatically generate trade journals</P>
                </Div>
                <Switch checked={settings.feature_toggles?.auto_journaling}
                  onCheckedChange={(checked) = /> updateToggle('feature_toggles', 'auto_journaling', checked)}
                />
              </Switch>
              <Separator />
              <Div className="flex items-center justify-between">
                <Div>
                  <Label>Smart Notifications</Separator>
                  <P className="text-sm text-gray-400">AI-powered alerts based on your activity</P>
                </Div>
                <Switch checked={settings.feature_toggles?.smart_notifications}
                  onCheckedChange={(checked) = /> updateToggle('feature_toggles', 'smart_notifications', checked)}
                />
              </Switch>
              <Separator />
              <Div className="flex items-center justify-between">
                <Div>
                  <Label>Voice Narration</Separator>
                  <P className="text-sm text-gray-400">Listen to AI-generated commentary</P>
                </Div>
                <Switch checked={settings.feature_toggles?.voice_narration}
                  onCheckedChange={(checked) = /> updateToggle('feature_toggles', 'voice_narration', checked)}
                />
              </Switch>
            </CardContent>
          </Card>

          {/* Advanced Features */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Features</Card>
              <CardDescription>
                Configure additional platform capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" />
              <Div className="flex items-center justify-between">
                <Div>
                  <Label>Keyboard Shortcuts</CardContent>
                  <P className="text-sm text-gray-400">Enable hotkeys for faster navigation</P>
                </Div>
                <Switch checked={settings.feature_toggles?.keyboard_shortcuts}
                  onCheckedChange={(checked) = /> updateToggle('feature_toggles', 'keyboard_shortcuts', checked)}
                />
              </Switch>
              <Separator />
              <Div className="flex items-center justify-between">
                <Div>
                  <Label>Beta Features</Separator>
                  <P className="text-sm text-gray-400">Try experimental features before they're released</P>
                </Div>
                <Switch checked={settings.feature_toggles?.beta_features}
                  onCheckedChange={(checked) = /> updateToggle('feature_toggles', 'beta_features', checked)}
                />
              </Switch>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6" />
          {/* AI Coaching */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center" />
                <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
                AI Coaching Style
              </TabsContent>
              <CardDescription>
                Choose how the AI coach interacts with you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" />
              <RadioGroup value={settings.coaching_tone || "balanced"}
                onValueChange={(value) = /> setSettings({ ...settings, coaching_tone: value as any })}
                className="space-y-4"
              >
                <Div className="flex items-center space-x-3">
                  <RadioGroupItem value="supportive" id="supportive" />
                  <Label htmlFor="supportive" className="font-medium">Supportive</CardContent>
                  <P className="text-sm text-gray-400 ml-2">Focuses on encouragement and positive reinforcement</P>
                </Div>
                <Div className="flex items-center space-x-3">
                  <RadioGroupItem value="balanced" id="balanced" />
                  <Label htmlFor="balanced" className="font-medium">Balanced</Div>
                  <P className="text-sm text-gray-400 ml-2">Provides a mix of encouragement and constructive feedback</P>
                </Div>
                <Div className="flex items-center space-x-3">
                  <RadioGroupItem value="challenging" id="challenging" />
                  <Label htmlFor="challenging" className="font-medium">Challenging</Div>
                  <P className="text-sm text-gray-400 ml-2">Pushes you with direct feedback and high expectations</P>
                </Div>
                <Div className="flex items-center space-x-3">
                  <RadioGroupItem value="analytical" id="analytical" />
                  <Label htmlFor="analytical" className="font-medium">Analytical</Div>
                  <P className="text-sm text-gray-400 ml-2">Focuses on data, metrics, and objective analysis</P>
                </Div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center" />
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                Reminder Frequency
              </Card>
              <CardDescription>
                How often would you like to receive coaching reminders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" />
              <RadioGroup value={settings.reminder_frequency || "daily"}
                onValueChange={(value) = /> setSettings({ ...settings, reminder_frequency: value as any })}
              >
                <Div className="flex items-center space-x-3">
                  <RadioGroupItem value="hourly" id="hourly" />
                  <Label htmlFor="hourly">Hourly</CardContent>
                </Div>
                <Div className="flex items-center space-x-3">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily">Daily</Div>
                </Div>
                <Div className="flex items-center space-x-3">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">Weekly</Div>
                </Div>
                <Div className="flex items-center space-x-3">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Custom</Div>
                </Div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Language */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center" />
                <Globe className="w-5 h-5 mr-2 text-blue-400" />
                {t('settings.language')} & {t('settings.region')}
              </Card>
              <CardDescription>
                {t('settings.chooseLanguage')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" />
              <Div className="space-y-2">
                <Label>{t('settings.language')}</CardContent>
                <Select value={settings.language || "en"}
                  onValueChange={(value) = /> {
                    setSettings({ ...settings, language: value });
                    // We don't call changeLanguage here because we want to wait for the save button
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('settings.selectLanguage')} />
                  </Select>
                  <SelectContent>
                    <SelectItem value="en" />🇬🇧 English</SelectContent>
                    <SelectItem value="es" />🇪🇸 Español</SelectItem>
                    <SelectItem value="fr" />🇫🇷 Français</SelectItem>
                    <SelectItem value="de" />🇩🇪 Deutsch</SelectItem>
                    <SelectItem value="pt" />🇵🇹 Português</SelectItem>
                    <SelectItem value="zh" />🇨🇳 中文</SelectItem>
                    <SelectItem value="ja" />🇯🇵 日本語</SelectItem>
                  </SelectContent>
                </Select>
              </Div>
            </CardContent>
          </Card>

          {/* Audio Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center" />
                <Volume2 className="w-5 h-5 mr-2 text-blue-400" />
                Audio Settings
              </Card>
              <CardDescription>
                Configure sound effects and voice narration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6" />
              <Div className="space-y-2">
                <Div className="flex items-center justify-between">
                  <Label>Enable Sound Effects</CardContent>
                  <Switch checked={settings.audio_settings?.sounds_enabled || false}
                    onCheckedChange={(checked) = /> 
                      setSettings({
                        ...settings,
                        audio_settings: {
                          ...settings.audio_settings,
                          sounds_enabled: checked
                        }
                      })
                    }
                  />
                </Switch>
                {settings.audio_settings?.sounds_enabled && (
                  <Div className="space-y-4 pt-2">
                    <Div className="space-y-2">
                      <Div className="flex justify-between">
                        <Label>Sound Volume</Div>
                        <Span className="text-sm text-gray-400">
                          {settings.audio_settings?.volume || 80}%
                        </Span>
                      </Div>
                      <Slider value={[settings.audio_settings?.volume || 80]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) = />
                          setSettings({
                            ...settings,
                            audio_settings: {
                              ...settings.audio_settings,
                              volume: value[0]
                            }
                          })
                        }
                      />
                    </Slider>
                  </Div>
                )}
              </Div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="wallet" className="space-y-6" />
          {/* Wallet Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center" />
                <Smartphone className="w-5 h-5 mr-2 text-blue-400" />
                Wallet Connection
              </TabsContent>
              <CardDescription>
                Connect your cryptocurrency wallet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" />
              <Div className="bg-black/30 p-4 rounded-lg border border-white/10">
                <Div className="flex items-center justify-between">
                  <Div className="flex items-center space-x-3">
                    <Div className="bg-blue-500/20 p-2 rounded-full">
                      <Smartphone className="w-5 h-5 text-blue-400" />
                    </CardContent>
                    <Div>
                      <Div className="font-medium">MetaMask</Div>
                      <Div className="text-sm text-gray-400">Connect your Ethereum wallet</Div>
                    </Div>
                  </Div>
                  <Button variant="outline"
                    onClick={() = /> {
                      toast({
                        title: "Wallet Connection",
                        description: "Redirecting to wallet connection page...",
                      });
                      setTimeout(() => {
                        window.location.href = '/crypto-payment';
                      }, 1000);
                    }}
                  >
                    Connect
                  </Button>
                </Div>
              </Div>
              
              <Div className="bg-black/30 p-4 rounded-lg border border-white/10">
                <Div className="flex items-center justify-between">
                  <Div className="flex items-center space-x-3">
                    <Div className="bg-yellow-500/20 p-2 rounded-full">
                      <Smartphone className="w-5 h-5 text-yellow-400" />
                    </Div>
                    <Div>
                      <Div className="font-medium">Bitcoin Wallet</Div>
                      <Div className="text-sm text-gray-400">Connect your Bitcoin wallet</Div>
                    </Div>
                  </Div>
                  <Button variant="outline"
                    onClick={() = /> {
                      toast({
                        title: "Wallet Connection",
                        description: "Redirecting to wallet connection page...",
                      });
                      setTimeout(() => {
                        window.location.href = '/crypto-payment';
                      }, 1000);
                    }}
                  >
                    Connect
                  </Button>
                </Div>
              </Div>
            </CardContent>
          </Card>
          
          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center" />
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                Payment History
              </Card>
              <CardDescription>
                View your previous crypto payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Div className="space-y-4">
                <Div className="bg-black/30 p-4 rounded-lg border border-green-500/20">
                  <Div className="flex items-center justify-between">
                    <Div>
                      <Div className="font-medium">Pro Plan Subscription</CardContent>
                      <Div className="text-sm text-gray-400">0.05 ETH • Confirmed</Div>
                      <Div className="text-xs text-gray-500 mt-1">Transaction: 0x71C7...976F</Div>
                    </Div>
                    <Div className="text-right">
                      <Div className="text-green-400">Successful</Div>
                      <Div className="text-xs text-gray-400">June 15, 2023</Div>
                    </Div>
                  </Div>
                </Div>
                
                <Div className="bg-black/30 p-4 rounded-lg border border-white/10">
                  <Div className="flex items-center justify-between">
                    <Div>
                      <Div className="font-medium">Premium Plan Upgrade</Div>
                      <Div className="text-sm text-gray-400">0.1 ETH • Confirmed</Div>
                      <Div className="text-xs text-gray-500 mt-1">Transaction: 0x83D9...152A</Div>
                    </Div>
                    <Div className="text-right">
                      <Div className="text-green-400">Successful</Div>
                      <Div className="text-xs text-gray-400">December 3, 2023</Div>
                    </Div>
                  </Div>
                </Div>
                
                <Button variant="outline"
                  className="w-full"
                  onClick={() = /> {
                    toast({
                      title: "Payment History",
                      description: "Redirecting to full payment history...",
                    });
                  }}
                >
                  View Full History
                </Button>
              </Div>
            </CardContent>
          </Card>
          
          {/* Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center" />
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                Current Subscription
              </Card>
              <CardDescription>
                Manage your subscription plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 rounded-lg border border-blue-500/20">
                <Div className="flex items-center justify-between mb-4">
                  <Div>
                    <Div className="text-xl font-bold text-white">Premium Plan</CardContent>
                    <Div className="text-sm text-blue-300">Active until December 3, 2024</Div>
                  </Div>
                  <Div className="bg-green-500/20 px-3 py-1 rounded-full text-green-400 text-sm">
                    Active
                  </Div>
                </Div>
                
                <Div className="space-y-2 mb-6">
                  <Div className="flex items-center text-sm">
                    <Span className="text-green-400 mr-2">✓</Div>
                    All trading features
                  </Div>
                  <Div className="flex items-center text-sm">
                    <Span className="text-green-400 mr-2">✓</Div>
                    Advanced AI coaching
                  </Div>
                  <Div className="flex items-center text-sm">
                    <Span className="text-green-400 mr-2">✓</Div>
                    Unlimited backtests
                  </Div>
                </Div>
                
                <Div className="flex space-x-3">
                  <Button variant="outline"
                    className="flex-1"
                    onClick={() = /> {
                      toast({
                        title: "Subscription",
                        description: "Redirecting to upgrade options...",
                      });
                      setTimeout(() => {
                        window.location.href = '/crypto-payment';
                      }, 1000);
                    }}
                  >
                    Upgrade
                  </Div>
                  <Button variant="outline"
                    className="flex-1 border-red-500/20 text-red-400 hover:bg-red-950/20"
                    onClick={() = /> {
                      toast({
                        title: "Subscription",
                        description: "Please contact support to cancel your subscription.",
                        variant: "destructive",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </Div>
              </Div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {hasChanges() && (
        <Div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/90 backdrop-blur-sm border-t border-gray-800 flex items-center justify-center z-10">
          <Div className="flex items-center gap-4">
            <P className="text-white">You have unsaved changes</Div>
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" 
              onClick={() = /> setSettings(originalSettings)}
            >
              Discard
            </Button>
          </Div>
        </Div>
      )}
    </Div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 