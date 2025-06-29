import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Volume2, VolumeX, Play, Pause, Bot, Settings, RefreshCw } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { useAuditLog } from '@/lib/monitoring/auditLogger';
import { generateLessonNarration, NarratorContext, NarratorOptions } from '@/lib/academy/generateLessonNarrator';

interface LessonNarratorProps {
  lessonId: string;
  courseId: string;
  sectionId: string;
  sectionContent: string;
  title: string;
  difficulty: string;
  topics: string[];
}

export default function LessonNarrator({ 
  lessonId,
  courseId,
  sectionId, 
  sectionContent, 
  title, 
  difficulty,
  topics
}: LessonNarratorProps) {
  const { user } = useAuth();

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
  const { logClick } = useAuditLog();
  
  const [narration, setNarration] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [enabled, setEnabled] = useState<boolean>(true);
  const [playing, setPlaying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [volume, setVolume] = useState<number>(80);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  // Narrator options state
  const [narratorOptions, setNarratorOptions] = useState<partial<NarratorOptions>>({
    voice: 'friendly',
    style: 'educational',
    pace: 'medium',
  });

  // Effect to load narration when component mounts or when section changes
  useEffect(() => {
    if (!enabled || !user) return;
    
    loadNarration();
  }, [sectionId, enabled, user]);

  const loadNarration = async () => {
    if (!user || !enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Create context for narration
      const context: NarratorContext = {
        lessonSection: sectionId,
        lessonTitle: title,
        difficulty: difficulty,
        topics: topics,
        // We'll expand this with user progress data in a real implementation
      };
      
      // Get user progress data for personalization
      const userContext = await getUserProgress(user.id, courseId);
      
      if (userContext) {
        context.userProgress = userContext.progress;
        context.userInterests = userContext.interests;
      }
      
      // Generate narration using the service
      const generatedNarration = await generateLessonNarration(
        user.id,
        courseId,
        sectionContent,
        context,
        narratorOptions
      );
      
      setNarration(generatedNarration);
      logClick('NarrationGenerated', { sectionId, courseId });
    } catch (err) {
      console.error('Error generating narration:', err);
      setError('Unable to generate narration for this section. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Mock function to get user progress - would connect to real DB in production
  const getUserProgress = async (userId: string, courseId: string) => {
    // In production, we would fetch this from the database
    // This is a mock for development
    return {
      progress: {
        previousSections: ['Introduction to Technical Analysis', 'Support and Resistance'],
        completedLessons: ['Basic Chart Patterns', 'Candlestick Basics'],
        learningStrengths: ['Technical Analysis', 'Pattern Recognition'],
        learningWeaknesses: ['Risk Management', 'Position Sizing'],
        studyTime: 120 // in minutes
      },
      interests: ['Cryptocurrency', 'Day Trading', 'Algorithmic Strategies']
    };
  };

  const handlePlayPause = () => {
    logClick('NarrationPlayToggle', { playing: !playing });
    setPlaying(!playing);
    
    // In a real implementation, this would control text-to-speech
    // For now we'll just toggle the state
  };
  
  const handleRegenerateNarration = () => {
    logClick('RegenerateNarration');
    loadNarration();
  };
  
  const handleVoiceChange = (voice: 'friendly' | 'professional' | 'enthusiastic' | 'calm') => {
    setNarratorOptions(prev => ({ ...prev, voice }));
    logClick('ChangeNarratorVoice', { voice });
  };
  
  const handleStyleChange = (style: 'conversational' | 'educational' | 'coaching') => {
    setNarratorOptions(prev => ({ ...prev, style }));
    logClick('ChangeNarratorStyle', { style });
  };
  
  const handlePaceChange = (pace: 'slow' | 'medium' | 'fast') => {
    setNarratorOptions(prev => ({ ...prev, pace }));
    logClick('ChangeNarratorPace', { pace });
  };

  // Handle settings change
  const handleSettingsChange = () => {
    loadNarration();
    setShowSettings(false);
  };

  // If narration is disabled, render toggle only
  if (!enabled) {
    return (
      <Div className="flex items-center justify-between p-4 border rounded-lg border-gray-800 bg-gray-900/50 mb-6">
        <Div className="flex items-center gap-3">
          <bot className="h-5 w-5 text-blue-400" />
          <Div>
            <H3 className="font-medium">AI Narration</NarratorOptions>
            <P className="text-sm text-gray-400">Get personalized commentary on this lesson</P>
          </Div>
        </Div>
        <Switch checked={enabled} onCheckedChange={(checked) = /> {
          setEnabled(checked);
          logClick('ToggleNarration', { enabled: checked });
        }} / />
    );
  }

  return (
    <Card className="mb-6 border-blue-600/30 bg-blue-900/10 shadow-blue-900/10 shadow-sm" />
      <CardHeader className="pb-2" />
        <Div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg text-blue-400" />
            <bot className="mr-2 h-5 w-5" />
            AI Lesson Narrator
          </Switch>
          <Div className="flex items-center gap-2">
            {loading ? (
              <Div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></Div>
            ) : (
              <Button variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-blue-400"
                onClick={handleRegenerateNarration}
     >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            
            <popover open={showSettings} onOpenChange={setShowSettings}>
              <popoverTrigger asChild>
                <Button variant="ghost" 
                  size="icon"
                  className="h-8 w-8 text-blue-400"
                  onClick={() = /> {
                    setShowSettings(!showSettings);
                    logClick('OpenNarratorSettings');
                  }}
                >
                  <Settings className="h-4 w-4" />
                </button />
              <popoverContent className="w-80 p-4">
                <Div className="space-y-4">
                  <H4 className="font-medium text-sm">Narrator Settings</Button>
                  
                  <Div className="space-y-2">
                    <H5 className="text-sm font-medium">Voice Style</Div>
                    <RadioGroup value={narratorOptions.voice} 
                      onValueChange={(value) = /> handleVoiceChange(value as any)}
                      className="grid grid-cols-2 gap-2"
                    >
                      <Div className="flex items-center space-x-2">
                        <RadioGroupItem value="friendly" id="friendly" />
                        <Label htmlFor="friendly">Friendly</RadioGroup>
                      </Div>
                      <Div className="flex items-center space-x-2">
                        <RadioGroupItem value="professional" id="professional" />
                        <Label htmlFor="professional">Professional</Div>
                      </Div>
                      <Div className="flex items-center space-x-2">
                        <RadioGroupItem value="enthusiastic" id="enthusiastic" />
                        <Label htmlFor="enthusiastic">Enthusiastic</Div>
                      </Div>
                      <Div className="flex items-center space-x-2">
                        <RadioGroupItem value="calm" id="calm" />
                        <Label htmlFor="calm">Calm</Div>
                      </div />
                  </Div>
                  
                  <Separator />
                  
                  <Div className="space-y-2">
                    <H5 className="text-sm font-medium">Teaching Style</Separator>
                    <RadioGroup value={narratorOptions.style} 
                      onValueChange={(value) = /> handleStyleChange(value as any)}
                    >
                      <Div className="flex items-center space-x-2">
                        <RadioGroupItem value="conversational" id="conversational" />
                        <Label htmlFor="conversational">Conversational</RadioGroup>
                      </Div>
                      <Div className="flex items-center space-x-2">
                        <RadioGroupItem value="educational" id="educational" />
                        <Label htmlFor="educational">Educational</Div>
                      </Div>
                      <Div className="flex items-center space-x-2">
                        <RadioGroupItem value="coaching" id="coaching" />
                        <Label htmlFor="coaching">Coaching</Div>
                      </div />
                  </Div>
                  
                  <Separator />
                  
                  <Div className="space-y-2">
                    <H5 className="text-sm font-medium">Teaching Pace</Separator>
                    <RadioGroup value={narratorOptions.pace} 
                      onValueChange={(value) = /> handlePaceChange(value as any)}
                      className="grid grid-cols-3 gap-2"
                    >
                      <Div className="flex items-center space-x-2">
                        <RadioGroupItem value="slow" id="slow" />
                        <Label htmlFor="slow">Slow</RadioGroup>
                      </Div>
                      <Div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium">Medium</Div>
                      </Div>
                      <Div className="flex items-center space-x-2">
                        <RadioGroupItem value="fast" id="fast" />
                        <Label htmlFor="fast">Fast</Div>
                      </div />
                  </Div>
                  
                  <Button onClick={handleSettingsChange} className="w-full">
                    Apply Settings
                  </Button>
                </div />
            </Popover>
            
            <Switch checked={enabled} 
              onCheckedChange={(checked) = /> {
                setEnabled(checked);
                logClick('ToggleNarration', { enabled: checked });
              }} 
            / />
        </div />
      <CardContent>
        {loading ? (
          <Div className="space-y-2 py-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" / />
        ) : error ? (
          <alert variant="destructive">
            <alertDescription>{error}</AlertDescription />
        ) : (
          <>
            <Div className="bg-blue-950/20 rounded-md p-3 mb-3 max-h-60 overflow-y-auto text-gray-200">
              <Div className="space-y-2 text-sm whitespace-pre-line">
                {narration}
              </Switch>
            </Div>
            
            <Div className="flex items-center justify-between">
              <Button variant="outline" 
                size="sm"
                className={`${playing ? 'bg-blue-600 text-white' : ''} w-24`}
                onClick={handlePlayPause}
              />
                {playing ? (
                  <><pause className="h-3 w-3 mr-2" /> Pause</>
                ) : (
                  <><play className="h-3 w-3 mr-2" /> Listen</>
                )}
              </Div>
              
              <Div className="flex items-center gap-4">
                <Div className="flex items-center gap-2">
                  <Button variant="ghost" 
                    size="icon"
                    className="h-8 w-8" 
                    onClick={() = /> setVolume(volume === 0 ? 80 : 0)}
                  >
                    {volume === 0 ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Div>
                  <Slider value={[volume]}
                    max={100}
                    step={1}
                    className="w-24"
                    onValueChange={(value) = /> {
                      setVolume(value[0]);
                      logClick('AdjustNarratorVolume', { volume: value[0] });
                    }}
                  / />
                
                <Div className="flex items-center gap-2">
                  <Span className="text-xs text-gray-400">Speed:</Slider>
                  <Select
                    className="bg-transparent text-xs border border-gray-700 rounded px-1 py-0.5"
                    value={playbackSpeed}
                    onChange={(e) => {
                      setPlaybackSpeed(parseFloat(e.target.value));
                      logClick('AdjustNarratorSpeed', { speed: e.target.value });
                    }}
                  >
                    <Option value="0.5">0.5x</Select>
                    <Option value="0.75">0.75x</Option>
                    <Option value="1">1x</Option>
                    <Option value="1.25">1.25x</Option>
                    <Option value="1.5">1.5x</Option>
                    <Option value="2">2x</Option />
                </Option>
              </Div>
            </Div>
          </>
        )}
      </CardContent />
  );
} 