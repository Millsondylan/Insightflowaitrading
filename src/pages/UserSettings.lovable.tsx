import React, { useState } from 'react';
import { Bell, Mail, Smartphone, AlertCircle, Palette, Bot, Globe, Volume2, Clock, MessageSquare } from 'lucide-react';

// Audio Settings Interface
interface AudioSettings {
  sounds_enabled: boolean;
  volume: number;
  voice_narration: boolean;
  notification_sounds: boolean;
}

// User Settings Interface  
interface UserSettings {
  audio_settings: AudioSettings;
  theme_preferences: {
    mode: 'light' | 'dark';
    accent_color: string;
  };
  notification_channels: {
    email: boolean;
    push: boolean;
    in_app: boolean;
  };
}

// Simple UI Components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <Div className={`bg-gray-800/50 border border-gray-700 rounded-lg backdrop-blur-sm ${className}`}>
    {children}
  </Div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <Div className="p-6 pb-4">{children}</Div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <H3 className="text-lg font-semibold text-white">{children}</H3>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <Div className="p-6 pt-0">{children}</Div>
);

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = "default",
  className = ""
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  disabled?: boolean;
  variant?: "default" | "outline";
  className?: string;
}) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-all duration-200";
  const variantClasses = variant === "outline" 
    ? "border border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500" 
    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  
  return (
    <Button className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}>
      {children}
    </Button>
  );
};

const Switch = ({ 
  checked, 
  onCheckedChange, 
  disabled = false 
}: { 
  checked: boolean; 
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) => (
  <Button  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
      checked ? 'bg-blue-600' : 'bg-gray-600'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    onClick={() => !disabled && onCheckedChange(!checked)}
    disabled={disabled}
  >
    <Span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </Button>
);

const Slider = ({ 
  value, 
  onValueChange, 
  min = 0, 
  max = 100, 
  step = 1,
  disabled = false 
}: { 
  value: number; 
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}) => (
  <Div className="w-full">
    <Input type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) = /> onValueChange(Number(e.target.value))}
      disabled={disabled}
      className={`w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      style={{
        background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(value - min) / (max - min) * 100}%, #4B5563 ${(value - min) / (max - min) * 100}%, #4B5563 100%)`
      }}
    />
         <style>{`
       .slider::-webkit-slider-thumb {
         appearance: none;
         height: 16px;
         width: 16px;
         border-radius: 50%;
         background: #3B82F6;
         cursor: pointer;
         box-shadow: 0 2px 4px rgba(0,0,0,0.2);
       }
       .slider::-moz-range-thumb {
         height: 16px;
         width: 16px;
         border-radius: 50%;
         background: #3B82F6;
         cursor: pointer;
         border: none;
         box-shadow: 0 2px 4px rgba(0,0,0,0.2);
       }
     `}</style>
  </Div>
);

const Label = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <Label className={`text-sm font-medium text-gray-300 ${className}`}>{children}</Label>
);

const Tabs = ({ children, defaultValue, className = "" }: { 
  children: React.ReactNode; 
  defaultValue: string;
  className?: string;
}) => (
  <Div className={className}>{children}</Div>
);

const TabsList = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <Div className={`flex bg-gray-800 rounded-lg p-1 ${className}`}>{children}</Div>
);

const TabsTrigger = ({ children, value, isActive, onClick }: { 
  children: React.ReactNode; 
  value: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <Button className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
    }`}
    onClick={onClick}
  />
    {children}
  </Button>
);

const TabsContent = ({ children, value, activeTab }: { 
  children: React.ReactNode; 
  value: string;
  activeTab: string;
}) => (
  activeTab === value ? <Div>{children}</Div> : null
);

const RadioGroup = ({ children, value, onValueChange, className = "" }: {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}) => (
  <Div className={className}>{children}</Div>
);

const RadioGroupItem = ({ value, id, checked, onChange }: {
  value: string;
  id: string;
  checked: boolean;
  onChange: (value: string) => void;
}) => (
  <Input type="radio"
    id={id}
    value={value}
    checked={checked}
    onChange={() = /> onChange(value)}
    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600"
  />
);

const Select = ({ children, value, onValueChange }: {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
}) => (
  <Select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
  >
    {children}
  </Input>
);

const SelectTrigger = ({ children }: { children: React.ReactNode }) => <Div>{children}</Div>;
const SelectValue = ({ placeholder }: { placeholder: string }) => <Span>{placeholder}</Span>;
const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const SelectItem = ({ children, value }: { children: React.ReactNode; value: string }) => (
  <Option value={value}>{children}</Option>
);

const DEFAULT_SETTINGS: Partial<UserSettings> = {
  notification_channels: {
    email: true,
    push: true,
    in_app: true,
  },
  audio_settings: {
    sounds_enabled: false,
    volume: 80,
    voice_narration: false,
    notification_sounds: true
  },
  theme_preferences: {
    mode: "dark",
    accent_color: "#3B82F6",
  },
};

export default function UserSettings() {
  const [settings, setSettings] = useState<UserSettings>({
    audio_settings: {
      sounds_enabled: false,
      volume: 80,
      voice_narration: false,
      notification_sounds: true
    },
    theme_preferences: {
      mode: 'dark',
      accent_color: '#3B82F6'
    },
    notification_channels: {
      email: true,
      push: true,
      in_app: true
    }
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateAudioSetting = (key: keyof AudioSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      audio_settings: {
        ...prev.audio_settings,
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const updateNotificationSetting = (key: keyof UserSettings['notification_channels'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notification_channels: {
        ...prev.notification_channels,
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasChanges(false);
    
    // Show success message
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    successDiv.textContent = 'Settings saved successfully!';
    document.body.appendChild(successDiv);
    setTimeout(() => document.body.removeChild(successDiv), 3000);
  };

  const handleReset = () => {
    setSettings({
      audio_settings: {
        sounds_enabled: false,
        volume: 80,
        voice_narration: false,
        notification_sounds: true
      },
      theme_preferences: {
        mode: 'dark',
        accent_color: '#3B82F6'
      },
      notification_channels: {
        email: true,
        push: true,
        in_app: true
      }
    });
    setHasChanges(true);
  };

  return (
    <Div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <Div className="mb-8">
          <H1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            ⚙️ User Settings
          </UserSettings>
          <P className="text-gray-400">
            Customize your InsightFlow AI Trading experience
          </P>
        </Div>

        <Div className="space-y-6">
          {/* Audio Settings */}
          <Card>
            <CardHeader>
              <CardTitle>🔊 Audio Settings</Div>
            </CardHeader>
            <CardContent>
              <Div className="space-y-6">
                {/* Enable Sounds */}
                <Div className="flex items-center justify-between">
                  <Div>
                    <H4 className="text-white font-medium">Enable Sounds</CardContent>
                    <P className="text-sm text-gray-400">Turn on/off all sound effects</P>
                  </Div>
                  <Switch
                    checked={settings.audio_settings.sounds_enabled}
                    onCheckedChange={(checked) => updateAudioSetting('sounds_enabled', checked)}
                  />
                </Switch>

                {/* Volume Control */}
                <Div className="space-y-2">
                  <Div className="flex items-center justify-between">
                    <H4 className="text-white font-medium">Volume</Div>
                    <Span className="text-blue-400 font-mono">
                      {settings.audio_settings.volume}%
                    </Span>
                  </Div>
                  <Slider
                    value={settings.audio_settings.volume}
                    onValueChange={(value) => updateAudioSetting('volume', value)}
                    disabled={!settings.audio_settings.sounds_enabled}
                  />
                </Slider>

                {/* Voice Narration */}
                <Div className="flex items-center justify-between">
                  <Div>
                    <H4 className="text-white font-medium">Voice Narration</Div>
                    <P className="text-sm text-gray-400">AI voice for lessons and alerts</P>
                  </Div>
                  <Switch
                    checked={settings.audio_settings.voice_narration}
                    onCheckedChange={(checked) => updateAudioSetting('voice_narration', checked)}
                    disabled={!settings.audio_settings.sounds_enabled}
                  />
                </Switch>

                {/* Notification Sounds */}
                <Div className="flex items-center justify-between">
                  <Div>
                    <H4 className="text-white font-medium">Notification Sounds</Div>
                    <P className="text-sm text-gray-400">Sound alerts for trades and updates</P>
                  </Div>
                  <Switch
                    checked={settings.audio_settings.notification_sounds}
                    onCheckedChange={(checked) => updateAudioSetting('notification_sounds', checked)}
                    disabled={!settings.audio_settings.sounds_enabled}
                  />
                </Switch>
              </Div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>📢 Notification Channels</Card>
            </CardHeader>
            <CardContent>
              <Div className="space-y-6">
                <Div className="flex items-center justify-between">
                  <Div>
                    <H4 className="text-white font-medium">Email Notifications</CardContent>
                    <P className="text-sm text-gray-400">Receive updates via email</P>
                  </Div>
                  <Switch
                    checked={settings.notification_channels.email}
                    onCheckedChange={(checked) => updateNotificationSetting('email', checked)}
                  />
                </Switch>

                <Div className="flex items-center justify-between">
                  <Div>
                    <H4 className="text-white font-medium">Push Notifications</Div>
                    <P className="text-sm text-gray-400">Browser push notifications</P>
                  </Div>
                  <Switch
                    checked={settings.notification_channels.push}
                    onCheckedChange={(checked) => updateNotificationSetting('push', checked)}
                  />
                </Switch>

                <Div className="flex items-center justify-between">
                  <Div>
                    <H4 className="text-white font-medium">In-App Notifications</Div>
                    <P className="text-sm text-gray-400">Show notifications within the app</P>
                  </Div>
                  <Switch
                    checked={settings.notification_channels.in_app}
                    onCheckedChange={(checked) => updateNotificationSetting('in_app', checked)}
                  />
                </Switch>
              </Div>
            </CardContent>
          </Card>

          {/* Theme Preview */}
          <Card>
            <CardHeader>
              <CardTitle>🎨 Theme Preview</Card>
            </CardHeader>
            <CardContent>
              <Div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <P className="text-white mb-2">Current Theme: <Span className="text-blue-400">Dark Mode</CardContent></P>
                <Div className="flex items-center gap-2">
                  <Div className="w-4 h-4 rounded-full bg-blue-600"></Div>
                  <Span className="text-gray-300">Accent Color: Blue</Span>
                </Div>
              </Div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Div className="flex gap-4 pt-4">
            <Button onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="flex-1"
            />
              {isSaving ? '💾 Saving...' : '💾 Save Changes'}
            </Div>
            <Button onClick={handleReset}
              variant="outline"
              className="flex-1"
        >
              🔄 Reset to Defaults
            </Button>
          </Div>

          {/* Status */}
          {hasChanges && (
            <Div className="text-center">
              <P className="text-yellow-400 text-sm"></Div></Div>⚠️ You have unsaved changes</Div>
            </Div>
          )}
        </Div>
      </Div>
    </Div>
  );
}


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 