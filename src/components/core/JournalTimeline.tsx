
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
      <Div className="w-full py-8 text-center">
        <P className="text-gray-500">Loading journal entries...</JournalTimelineProps>
      </Div>
    );
  }

  if (error) {
    return (
      <Div className="w-full py-8 text-center">
        <P className="text-red-500">Error: {error}</Div>
      </Div>
    );
  }

  if (entries.length === 0) {
    return (
      <Div className="w-full py-12 text-center">
        <P className="text-gray-400">No journal entries yet. Create your first trade journal entry above!</Div>
      </Div>
    );
  }

  return (
    <Div className="space-y-6 journal-timeline">
      {entries.map((entry, index) => {
        const profitLoss = calculateProfitLoss(entry);
        const isProfitable = profitLoss > 0;
        const isReflectionExpanded = expandedReflections.has(entry.id);

        return (
          <Div key={entry.id}
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
            <Card className="overflow-hidden border-t-4 hover:shadow-lg transition-shadow duration-200" />
              <Div                 className={cn(
                  "border-t-4 -mt-0.5",
                  entry.sentiment === "Bullish"
                    ? "border-green-500"
                    : "border-red-500"
                )}
              />
              <CardHeader className="flex flex-row items-center justify-between py-4" />
                <Div className="flex items-center space-x-2">
                  <Badge variant="outline"
                    className={cn(
                      "font-medium",
                      entry.sentiment === "Bullish"
                        ? "bg-green-600/20 text-green-500 border-green-500/30"
                        : "bg-red-600/20 text-red-500 border-red-500/30"
                    )}
                  />
                    {entry.sentiment}
                  </Div>
                  <Span className="text-sm text-gray-400">{formatDate(entry.createdAt)}</Span>
                </Div>
                <Div className="flex items-center space-x-2">
                  <Badge variant="outline"
                    className={cn(
                      "font-medium",
                      isProfitable
                        ? "bg-green-600/20 text-green-500 border-green-500/30"
                        : "bg-red-600/20 text-red-500 border-red-500/30"
                    )}
       >
                    {isProfitable ? "+" : ""}{profitLoss.toFixed(2)}%
                  </Div>
                  
                  <Button variant="ghost"
                    size="sm"
                    onClick={() = /> toggleReflection(entry.id)}
                    className="h-8 w-8 p-0 hover:bg-blue-500/10"
                  >
                    <brain className="h-4 w-4 text-blue-400" />
                  </Button>
                </div />
              <CardContent className="pb-6" />
                <H3 className="text-xl font-medium mb-2">{entry.title}</CardContent>
                
                <Div className="flex justify-between mb-4">
                  <Div>
                    <Span className="text-gray-400 text-sm">Pair:</Div>
                    <Span className="ml-2 font-medium">{entry.pair}</Span>
                  </Div>
                  <Div>
                    <Span className="text-gray-400 text-sm">Timeframe:</Div>
                    <Span className="ml-2 font-medium">{entry.timeframe}</Span>
                  </Div>
                </Div>
                
                <Div className="grid grid-cols-2 gap-2 mb-4">
                  <Div className="flex flex-col">
                    <Span className="text-gray-400 text-sm">Entry</Div>
                    <Span className="font-medium">{entry.entryPrice}</Span>
                  </Div>
                  <Div className="flex flex-col">
                    <Span className="text-gray-400 text-sm">Exit</Div>
                    <Span className="font-medium">{entry.exitPrice}</Span>
                  </Div>
                </Div>
                
                {entry.reason && (
                  <Div className="mt-4 text-sm text-gray-300">
                    <P className="line-clamp-2">{entry.reason}</Div>
                  </Div>
                )}
                
                {entry.chartUrl && (
                  <Div className="mt-4 rounded-md overflow-hidden h-32 w-full bg-gray-900">
                    <Img 
                      src={entry.chartUrl} 
                      alt="Trade chart" 
                      className="h-full w-full object-cover"
                    />
                  </Div>
                )}
                
                {entry.tags && entry.tags.length > 0 && (
                  <Div className="mt-4 flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Div>
                    ))}
                  </Div>
                )}

                <Collapsible open={isReflectionExpanded} onOpenChange={() = /> toggleReflection(entry.id)}>
                  <CollapsibleTrigger asChild />
                    <Button variant="ghost"
                      className="w-full mt-4 flex items-center justify-between hover:bg-blue-500/5 border border-blue-500/20"
        >
                      <Div className="flex items-center space-x-2">
                        <brain className="h-4 w-4 text-blue-400" />
                        <Span className="text-blue-400">AI Analysis</Collapsible>
                      </Div>
                      {isReflectionExpanded ? (
                        <ChevronUp className="h-4 w-4 text-blue-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-blue-400" />
                      )}
                    </ChevronUp />
                  <CollapsibleContent className="mt-4" />
                    <aIReflection 
                      entry={entry} 
                      autoGenerate={false}
                      className="border-0 bg-black/20"
                    / />
                </Collapsible />
            </ChevronUp>
          </Div>
        );
      })}
    </Div>
  );
};

export default JournalTimeline;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
