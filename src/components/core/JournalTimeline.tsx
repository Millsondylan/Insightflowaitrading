
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { JournalEntry } from "@/lib/journal/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import AIReflection from "./AIReflection";
import { cn } from "@/lib/utils";
import { Brain, ChevronDown, ChevronUp } from "lucide-react";

// Dummy user ID for development until auth is implemented
const DUMMY_USER_ID = "current-user-id";

interface JournalTimelineProps {
  refreshTrigger?: number;
  limit?: number;
}

const JournalTimeline: React.FC<JournalTimelineProps> = ({ 
  refreshTrigger = 0, 
  limit = 10 
}) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedReflections, setExpandedReflections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch journal entries from Supabase using correct column names
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('userid', DUMMY_USER_ID)
          .order('createdat', { ascending: false })
          .limit(limit);

        if (error) {
          throw new Error(error.message);
        }

        // Map database column names to the expected format
        const mappedEntries = data?.map(entry => ({
          id: entry.id,
          title: entry.title,
          pair: entry.pair,
          timeframe: entry.timeframe,
          entryPrice: entry.entryprice,
          exitPrice: entry.exitprice,
          chartUrl: entry.charturl,
          reason: entry.reason,
          sentiment: entry.sentiment as "Bullish" | "Bearish",
          tags: entry.tags || [],
          createdAt: entry.createdat,
          userId: entry.userid
        })) || [];

        setEntries(mappedEntries as JournalEntry[]);
      } catch (err: any) {
        console.error('Error fetching journal entries:', err);
        setError(err.message || 'Failed to load journal entries');
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [refreshTrigger, limit]);

  // Format date from ISO string
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const calculateProfitLoss = (entry: JournalEntry): number => {
    const { entryPrice, exitPrice, sentiment } = entry;
    
    if (sentiment === 'Bullish') {
      return ((exitPrice - entryPrice) / entryPrice) * 100;
    } else {
      return ((entryPrice - exitPrice) / entryPrice) * 100;
    }
  };

  const toggleReflection = (entryId: string) => {
    setExpandedReflections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="w-full py-8 text-center">
        <p className="text-gray-500">Loading journal entries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-8 text-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-gray-400">No journal entries yet. Create your first trade journal entry above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 journal-timeline">
      {entries.map((entry, index) => {
        const profitLoss = calculateProfitLoss(entry);
        const isProfitable = profitLoss > 0;
        const isReflectionExpanded = expandedReflections.has(entry.id);

        return (
          <div key={entry.id}
            className={cn(
              "journal-entry-card opacity-0 transform translate-y-4",
              "animate-fade-in-up",
              { "animation-delay-100": index % 3 === 0 },
              { "animation-delay-200": index % 3 === 1 },
              { "animation-delay-300": index % 3 === 2 }
            )}
            style={{
              animationDelay: `${(index % 5) * 100}ms`,
              animationFillMode: "forwards"
            }}>
            <Card className="overflow-hidden border-t-4 hover:shadow-lg transition-shadow duration-200">
              <div className={cn(
                  "border-t-4 -mt-0.5",
                  entry.sentiment === "Bullish"
                    ? "border-green-500"
                    : "border-red-500"
                )} />
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline"
                    className={cn(
                      "font-medium",
                      entry.sentiment === "Bullish"
                        ? "bg-green-600/20 text-green-500 border-green-500/30"
                        : "bg-red-600/20 text-red-500 border-red-500/30"
                    )}>
                    {entry.sentiment}
                  </Badge>
                  <span className="text-sm text-gray-400">{formatDate(entry.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline"
                    className={cn(
                      "font-medium",
                      isProfitable
                        ? "bg-green-600/20 text-green-500 border-green-500/30"
                        : "bg-red-600/20 text-red-500 border-red-500/30"
                    )}>
                    {isProfitable ? "+" : ""}{profitLoss.toFixed(2)}%
                  </Badge>
                  
                  <Button variant="ghost"
                    size="sm"
                    onClick={() => toggleReflection(entry.id)}
                    className="h-8 w-8 p-0 hover:bg-blue-500/10">
                    <Brain className="h-4 w-4 text-blue-400" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <h3 className="text-xl font-medium mb-2">{entry.title}</h3>
                
                <div className="flex justify-between mb-4">
                  <div>
                    <span className="text-gray-400 text-sm">Pair:</span>
                    <span className="ml-2 font-medium">{entry.pair}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Timeframe:</span>
                    <span className="ml-2 font-medium">{entry.timeframe}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Entry</span>
                    <span className="font-medium">{entry.entryPrice}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Exit</span>
                    <span className="font-medium">{entry.exitPrice}</span>
                  </div>
                </div>
                
                {entry.reason && (
                  <div className="mt-4 text-sm text-gray-300">
                    <p className="line-clamp-2">{entry.reason}</p>
                  </div>
                )}
                
                {entry.chartUrl && (
                  <div className="mt-4 rounded-md overflow-hidden h-32 w-full bg-gray-900">
                    <img 
                      src={entry.chartUrl} 
                      alt="Trade chart" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                
                {entry.tags && entry.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Collapsible open={isReflectionExpanded} onOpenChange={() => toggleReflection(entry.id)}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost"
                      className="w-full mt-4 flex items-center justify-between hover:bg-blue-500/5 border border-blue-500/20">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-4 w-4 text-blue-400" />
                        <span className="text-blue-400">AI Analysis</span>
                      </div>
                      {isReflectionExpanded ? (
                        <ChevronUp className="h-4 w-4 text-blue-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-blue-400" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    <AIReflection 
                      entry={entry} 
                      autoGenerate={false}
                      className="border-0 bg-black/20"
                    />
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default JournalTimeline;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
