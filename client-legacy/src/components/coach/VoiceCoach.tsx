
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface VoiceCoachProps {
  onVoiceCommand?: (command: string) => void;
}

const VoiceCoach: React.FC<VoiceCoachProps> = ({ onVoiceCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Start listening
      setTranscript('Listening...');
    } else {
      // Stop listening
      setTranscript('');
    }
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="bg-black/30 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Voice Coach
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={toggleListening}
            variant={isListening ? "destructive" : "outline"}
            className={`flex items-center gap-2 ${
              isListening 
                ? "bg-red-500/20 text-red-400 border-red-400" 
                : "text-white border-white/20"
            }`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isListening ? 'Stop' : 'Listen'}
          </Button>

          <Button
            onClick={toggleSpeaking}
            variant="outline"
            className={`flex items-center gap-2 ${
              isSpeaking
                ? "bg-blue-500/20 text-blue-400 border-blue-400"
                : "text-white border-white/20"
            }`}
          >
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {isSpeaking ? 'Mute' : 'Speak'}
          </Button>

          <Button
            onClick={togglePlayback}
            variant="outline"
            className="text-white border-white/20"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
        </div>

        {transcript && (
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-white/80 text-sm">{transcript}</p>
          </div>
        )}

        <div className="text-white/60 text-sm">
          <p>Voice commands available:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Start lesson</li>
            <li>Pause lesson</li>
            <li>Next section</li>
            <li>Previous section</li>
            <li>Repeat section</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceCoach;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
