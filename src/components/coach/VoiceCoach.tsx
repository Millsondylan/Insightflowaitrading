import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../ui/use-toast';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { createCoachSession, updateCoachSessionTranscript, endCoachSession } from '../../lib/db/ai-coaching';
import { useAuth } from '../../hooks/use-auth';

interface VoiceCoachProps {
  marketContext?: {
    symbol: string;
    timeframe: string;
    indicators?: any[];
    price?: number;
    recentCandles?: any[];
  };
  strategyId?: string;
}

interface TranscriptMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function VoiceCoach({ marketContext, strategyId }: VoiceCoachProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null />(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Reset session when drawer is opened
  useEffect(() => {
    if (isDrawerOpen && !sessionId) {
      startNewSession();
    }
  }, [isDrawerOpen]);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (sessionId) {
        endCoachSession(sessionId);
      }
    };
  }, [sessionId]);

  async function startNewSession() {
    if (!user?.id) {
      toast({
        title: "Not logged in",
        description: "Please log in to use the voice coach",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data, error } = await createCoachSession(user.id, {
        market_context: marketContext,
        strategy_id: strategyId
      });
      
      if (error) throw new Error(error.message);
      
      setSessionId(data.id);
      setTranscript([]);
      
      // Add initial greeting
      const initialMessage = {
        role: 'assistant' as const,
        content: `Hello! I'm your trading coach. What would you like to discuss about ${marketContext?.symbol || 'the market'} today?`,
        timestamp: new Date().toISOString()
      };
      
      setTranscript([initialMessage]);
      await updateCoachSessionTranscript(data.id, initialMessage);
      
      if (autoSpeak) {
        speakText(initialMessage.content);
      }
    } catch (error) {
      console.error('Failed to create coaching session:', error);
      toast({
        title: "Error",
        description: "Failed to start coaching session",
        variant: "destructive"
      });
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Add visual cue that recording has started
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Microphone Error",
        description: "Cannot access your microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop the microphone stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  }

  async function processAudio(audioBlob: Blob) {
    if (!sessionId) return;
    
    setIsProcessing(true);
    
    try {
      // Create form data for the audio file
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('sessionId', sessionId);
      
      if (marketContext) {
        formData.append('marketContext', JSON.stringify(marketContext));
      }
      
      if (strategyId) {
        formData.append('strategyId', strategyId);
      }
      
      // Send to Whisper API via our backend
      const transcribeResponse = await fetch('/api/ai/transcribe', {
        method: 'POST',
        body: formData
      });
      
      if (!transcribeResponse.ok) {
        throw new Error('Failed to transcribe audio');
      }
      
      const transcribeResult = await transcribeResponse.json();
      const userMessage = transcribeResult.text;
      
      // Add user message to transcript
      const userTranscriptMsg = {
        role: 'user' as const,
        content: userMessage,
        timestamp: new Date().toISOString()
      };
      
      setTranscript(prev => [...prev, userTranscriptMsg]);
      await updateCoachSessionTranscript(sessionId, userTranscriptMsg);
      
      // Get coaching response
      const coachResponse = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          message: userMessage,
          marketContext,
          strategyId
        })
      });
      
      if (!coachResponse.ok) {
        throw new Error('Failed to get coaching response');
      }
      
      const coachResult = await coachResponse.json();
      const aiResponse = coachResult.response;
      
      // Add AI response to transcript
      const aiTranscriptMsg = {
        role: 'assistant' as const,
        content: aiResponse,
        timestamp: new Date().toISOString()
      };
      
      setTranscript(prev => [...prev, aiTranscriptMsg]);
      await updateCoachSessionTranscript(sessionId, aiTranscriptMsg);
      
      // Speak the response if auto-speak is enabled
      if (autoSpeak) {
        speakText(aiResponse);
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process audio. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }

  function speakText(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }

  async function handleEndSession() {
    if (sessionId) {
      await endCoachSession(sessionId);
      setSessionId(null);
      setIsDrawerOpen(false);
    }
  }

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
      <DrawerTrigger asChild />
        <Button variant="outline" 
          size="icon" 
          className="rounded-full h-12 w-12 fixed bottom-6 right-6 bg-primary text-primary-foreground shadow-lg hover:shadow-xl z-50">
          <Mic className="h-6 w-6" / />
      </TranscriptMessage>
      <DrawerContent className="max-h-[85vh]" />
        <DrawerHeader>
          <DrawerTitle className="flex items-center justify-between" />
            <Div>
              AI Voice Coach
              {marketContext?.symbol && (
                <Badge variant="outline" className="ml-2" />
                  {marketContext.symbol} {marketContext.timeframe}
                </DrawerContent>
              )}
            </Div>
            <Div className="flex items-center space-x-2">
              <Switch
                id="auto-speak"
                checked={autoSpeak}
                onCheckedChange={setAutoSpeak}
              />
              <Label htmlFor="auto-speak" />Auto-speak</Div>
            </div />
        </DrawerHeader>
        <CardContent>
          <Card className="border-none shadow-none" />
            <CardContent>
              <ScrollArea className="h-[50vh] pr-4" />
                <Div className="space-y-4">
                  {transcript.map((message, index) => (
                    <Div key={index} 
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
                      <Div className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
            >
                        <P>{message.content}</CardContent>
                        <Div className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </Div>
                      </Div>
                    </Div>
                  ))}
                </div />
            </CardContent>
            <CardFooter className="flex justify-between" />
              <Button variant="outline"
                onClick={handleEndSession}
   >
                End Session
              </CardFooter>
              <Button variant={isRecording ? "destructive" : "default"}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing || !sessionId}
                className="w-20"
   >
                {isRecording ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" /></Button></Button></Button></Button></Button></Button>}
                {isRecording ? "Stop" : "Talk"}
              </button />
          </Card />
      </DrawerContent />
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};

