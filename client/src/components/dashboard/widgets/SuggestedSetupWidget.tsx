
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { TradingViewChart } from '../../charts/TradingViewChart';
import { Skeleton } from '../../ui/skeleton';
import { ChevronRight, RefreshCcw, Bookmark } from 'lucide-react';
import { supabase } from '../../../integrations/supabase/client';
import { useToast } from '../../../hooks/use-toast';

interface SuggestedSetupProps {
  userId: string;
  data?: {
    savedSetup?: any;
  };
}

interface TradingSetup {
  id: string;
  symbol: string;
  timeframe: string;
  direction: 'long' | 'short';
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  rationale: string;
  created_at: string;
  image_url?: string;
}

export default function SuggestedSetupWidget({ userId, data }: SuggestedSetupProps) {
  const [setup, setSetup] = useState<TradingSetup | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadSetup() {
      if (!userId) return;
      
      try {
        // Try to fetch today's setup first
        const today = new Date().toISOString().split('T')[0];
        const { data: existingSetup } = await supabase
          .from('ai_suggested_setups')
          .select('*')
          .eq('user_id', userId)
          .gte('created_at', today)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (existingSetup) {
          setSetup(existingSetup);
          
          // Check if this setup is saved
          const { data: savedSetup } = await supabase
            .from('user_saved_setups')
            .select('*')
            .eq('user_id', userId)
            .eq('setup_id', existingSetup.id)
            .single();
          
          setSaved(!!savedSetup);
        } else {
          // Generate a new setup if none exists
          await generateSetup();
        }
      } catch (error) {
        console.error('Error loading suggested setup:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadSetup();
  }, [userId]);

  async function generateSetup() {
    if (!userId || generating) return;
    
    setGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-market-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate setup');
      }
      
      const data = await response.json();
      setSetup(data.setup);
      setSaved(false);
    } catch (error) {
      console.error('Error generating setup:', error);
      toast({
        title: "Error",
        description: "Failed to generate setup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  }
  
  async function saveSetup() {
    if (!userId || !setup) return;
    
    try {
      const { error } = await supabase
        .from('user_saved_setups')
        .insert({
          user_id: userId,
          setup_id: setup.id,
          notes: ''
        });
      
      if (error) throw error;
      
      setSaved(true);
      toast({
        title: "Setup Saved",
        description: "The setup has been saved to your collection.",
      });
    } catch (error) {
      console.error('Error saving setup:', error);
      toast({
        title: "Error",
        description: "Failed to save setup.",
        variant: "destructive"
      });
    }
  }
  
  const riskRewardRatio = setup
    ? Math.abs((setup.take_profit - setup.entry_price) / (setup.entry_price - setup.stop_loss)).toFixed(1)
    : "0";

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Today's Suggested Setup</CardTitle>
          <Button variant="ghost" size="icon" onClick={generateSetup} disabled={generating}>
            <RefreshCcw className={`h-4 w-4 ${generating ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription>
          AI-generated setup based on your trading profile
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        {loading || generating ? (
          <>
            <Skeleton className="w-full h-12 mb-4" />
            <Skeleton className="w-full h-32 mb-4" />
            <Skeleton className="w-full h-20" />
          </>
        ) : setup ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <div>
                <Badge variant={setup.direction === 'long' ? 'default' : 'destructive'} className="mb-1">
                  {setup.direction.toUpperCase()}
                </Badge>
                <h3 className="text-xl font-bold">{setup.symbol}</h3>
                <p className="text-sm text-muted-foreground">{setup.timeframe} Timeframe</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Risk/Reward</p>
                <p className="text-xl font-bold">1:{riskRewardRatio}</p>
              </div>
            </div>
            
            {setup.image_url ? (
              <div className="rounded-md overflow-hidden mb-3 h-40 bg-muted">
                <img 
                  src={setup.image_url} 
                  alt={`${setup.symbol} chart`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="rounded-md overflow-hidden mb-3 h-40 bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No chart image available</span>
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-1 mb-3 text-center">
              <div className="p-2 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground">Entry</p>
                <p className="font-medium">{setup.entry_price}</p>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-md">
                <p className="text-xs text-muted-foreground">Stop Loss</p>
                <p className="font-medium">{setup.stop_loss}</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-md">
                <p className="text-xs text-muted-foreground">Take Profit</p>
                <p className="font-medium">{setup.take_profit}</p>
              </div>
            </div>
            
            <p className="text-sm mt-2">{setup.rationale}</p>
          </>
        ) : (
          <div className="text-center p-4">
            <p className="text-muted-foreground">No setup available. Click Generate to create one.</p>
            <Button onClick={generateSetup} className="mt-4" disabled={generating}>
              Generate Setup
            </Button>
          </div>
        )}
      </CardContent>
      
      {setup && (
        <CardFooter className="pt-2 flex justify-between">
          <Button variant="outline" 
            size="sm" 
            onClick={saveSetup}
            disabled={saved}>
            {saved ? (
              <>
                <Bookmark className="mr-1 h-4 w-4 fill-primary" />
                Saved
              </>
            ) : (
              <>
                <Bookmark className="mr-1 h-4 w-4" />
                Save Setup
              </>
            )}
          </Button>
          
          <Button variant="ghost" 
            size="sm"
            asChild>
            <a href={`/trade-planner?symbol=${setup.symbol}&entry=${setup.entry_price}&sl=${setup.stop_loss}&tp=${setup.take_profit}&direction=${setup.direction}`}>
              Plan Trade
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
