import React, { useState } from 'react';
import { Bell, Mail, Smartphone, AlertCircle, Palette, Bot, Globe, Volume2, Clock, MessageSquare } from 'lucide-react';

// Simple UI Components for Lovable preview
const Card = ({ children, className = "" }) => (
  <div className={`bg-gray-800 border border-gray-700 rounded-lg p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, disabled = false, variant = "default" }) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors";
  const variantClasses = variant === "outline" 
    ? "border border-gray-600 text-gray-300 hover:bg-gray-700" 
    : "bg-blue-600 text-white hover:bg-blue-700";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${disabledClasses}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Switch = ({ checked, onCheckedChange }) => (
  <button
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      checked ? 'bg-blue-600' : 'bg-gray-600'
    }`}
    onClick={() => onCheckedChange(!checked)}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const Label = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <label className={`text-sm font-medium text-gray-300 ${className}`}>{children}</label>
);

const Tabs = ({ children, defaultValue, className = "" }: { 
  children: React.ReactNode; 
  defaultValue: string;
  className?: string;
}) => (
  <div className={className}>{children}</div>
);

const TabsList = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex bg-gray-800 rounded-lg p-1 ${className}`}>{children}</div>
);

const TabsTrigger = ({ children, value, isActive, onClick }: { 
  children: React.ReactNode; 
  value: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

const TabsContent = ({ children, value, activeTab }: { 
  children: React.ReactNode; 
  value: string;
  activeTab: string;
}) => (
  activeTab === value ? <div>{children}</div> : null
);

const Slider = ({ value, min, max, step, onValueChange }: {
  value: number[];
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number[]) => void;
}) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value[0]}
    onChange={(e) => onValueChange([parseInt(e.target.value)])}
    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
  />
);

const RadioGroup = ({ children, value, onValueChange, className = "" }: {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}) => (
  <div className={className}>{children}</div>
);

const RadioGroupItem = ({ value, id, checked, onChange }: {
  value: string;
  id: string;
  checked: boolean;
  onChange: (value: string) => void;
}) => (
  <input
    type="radio"
    id={id}
    value={value}
    checked={checked}
    onChange={() => onChange(value)}
    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600"
  />
);

const Select = ({ children, value, onValueChange }: {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
}) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
  >
    {children}
  </select>
);

const SelectTrigger = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const SelectValue = ({ placeholder }: { placeholder: string }) => <span>{placeholder}</span>;
const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const SelectItem = ({ children, value }: { children: React.ReactNode; value: string }) => (
  <option value={value}>{children}</option>
);

// Mock UserSettings interface
interface UserSettings {
  notification_channels: {
    email: boolean;
    push: boolean;
    in_app: boolean;
  };
  notification_types: {
    trade_alerts: boolean;
    market_updates: boolean;
    strategy_signals: boolean;
    journal_reminders: boolean;
    goal_progress: boolean;
    course_updates: boolean;
    community_mentions: boolean;
  };
  theme_preferences: {
    mode: 'light' | 'dark';
    accent_color: string;
    chart_theme: string;
  };
  feature_toggles: {
    ai_copilot: boolean;
    auto_journaling: boolean;
    smart_notifications: boolean;
    voice_narration: boolean;
    keyboard_shortcuts: boolean;
    beta_features: boolean;
  };
  audio_settings: {
    sounds_enabled: boolean;
    volume: number;
  };
  coaching_tone: 'supportive' | 'balanced' | 'challenging' | 'analytical';
  reminder_frequency: 'hourly' | 'daily' | 'weekly' | 'custom';
  language: string;
}

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
  theme_preferences: {
    mode: "dark",
    accent_color: "#3B82F6",
    chart_theme: "tradingview",
  },
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
  const [settings, setSettings] = useState<Partial<UserSettings>>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState("notifications");
  const [saving, setSaving] = useState(false);

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
  };

  const saveSettings = async () => {
    setSaving(true);
    // Mock save operation
    setTimeout(() => {
      setSaving(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-gray-400">Customize your trading platform experience</p>
          </div>
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">🔔</span>
              Notification Channels
            </h2>
            <p className="text-gray-400 mb-6">Choose how you want to receive notifications</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>📧</span>
                  <label className="text-sm font-medium">Email Notifications</label>
                </div>
                <Switch
                  checked={settings.notification_channels?.email || false}
                  onCheckedChange={(checked) => updateToggle('notification_channels', 'email', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>📱</span>
                  <label className="text-sm font-medium">Push Notifications</label>
                </div>
                <Switch
                  checked={settings.notification_channels?.push || false}
                  onCheckedChange={(checked) => updateToggle('notification_channels', 'push', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>⚠️</span>
                  <label className="text-sm font-medium">In-App Alerts</label>
                </div>
                <Switch
                  checked={settings.notification_channels?.in_app || false}
                  onCheckedChange={(checked) => updateToggle('notification_channels', 'in_app', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Audio Settings */}
          <Card>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">🔊</span>
              Audio Settings
            </h2>
            <p className="text-gray-400 mb-6">Configure sound effects and voice narration</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Enable Sound Effects</label>
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
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Sound Volume</label>
                    <span className="text-sm text-gray-400">
                      {settings.audio_settings?.volume || 80}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={settings.audio_settings?.volume || 80}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        audio_settings: {
                          ...settings.audio_settings,
                          volume: parseInt(e.target.value)
                        }
                      })
                    }
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Feature Toggles */}
          <Card>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">🤖</span>
              Feature Toggles
            </h2>
            <p className="text-gray-400 mb-6">Enable or disable platform features</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">AI Copilot</label>
                <Switch
                  checked={settings.feature_toggles?.ai_copilot || false}
                  onCheckedChange={(checked) => updateToggle('feature_toggles', 'ai_copilot', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto Journaling</label>
                <Switch
                  checked={settings.feature_toggles?.auto_journaling || false}
                  onCheckedChange={(checked) => updateToggle('feature_toggles', 'auto_journaling', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Smart Notifications</label>
                <Switch
                  checked={settings.feature_toggles?.smart_notifications || false}
                  onCheckedChange={(checked) => updateToggle('feature_toggles', 'smart_notifications', checked)}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const lovable = { component: true }; 