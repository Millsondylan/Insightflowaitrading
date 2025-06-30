
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

const JournalTimeline: React.FC<Journaltimelineprops > = ({ 
  refreshTrigger = 0, 
  limit = 10 
}) => {
  const [entries, setEntries] = useState<Journalentry />([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedReflections, setExpandedReflections] = useState<Set >>(new Set());

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
        <p className="text-gray-500">Loading journal entries...</Journaltimelineprops>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-8 text-center">
        <p className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-gray-400">No journal entries yet. Create your first trade journal entry above!</div>
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
            }}/>
            <Card >
              <div                 className={cn(
                  "border-t-4 -mt-0.5",
                  entry.sentiment === "Bullish"
                    ? "border-green-500"
                    : "border-red-500"
                )}
 />
              <Cardheader  style={{ display: "flex", alignItems: "center" }}>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {entry.sentiment}
                  </div>
                  <span className="text-sm text-gray-400">{formatDate(entry.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {isProfitable ? "+" : ""}{profitLoss.toFixed(2)}%
                  </div>
                  
                  <Button variant="ghost" size="sm"> toggleReflection(entry.id)}
                    className="h-8 w-8 p-0 hover:bg-blue-500/10"
                  >
                    <brain >
                  </button>
                </div />
              <Cardcontent >
                <h3 className="text-xl font-medium mb-2">{entry.title}</Cardcontent>
                
                <div className="flex justify-between mb-4">
                  <div>
                    <span className="text-gray-400 text-sm">Pair:</div>
                    <span className="ml-2 font-medium">{entry.pair}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Timeframe:</div>
                    <span className="ml-2 font-medium">{entry.timeframe}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Entry</div>
                    <span className="font-medium">{entry.entryPrice}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Exit</div>
                    <span className="font-medium">{entry.exitPrice}</span>
                  </div>
                </div>
                
                {entry.reason && (
                  <div className="mt-4 text-sm text-gray-300">
                    <p className="line-clamp-2">{entry.reason}</div>
                  </div>
                )}
                
                {entry.chartUrl && (
                  <div className="mt-4 rounded-md overflow-hidden h-32 w-full bg-gray-900">
                    <img 
                      src={entry.chartUrl} 
                      alt="Trade chart" 
                      className="h-full w-full object-cover"
       /></div>
                  </div>
                )}
                
                {entry.tags && entry.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <Badge variant="secondary" style={{ fontSize: "0.75rem" }}></div>
                        {tag}
                      </div>
                    ))}
                  </div>
                )}

                <collapsible > toggleReflection(entry.id)}>
                  <collapsibletrigger >
                    <Button variant="ghost" style={{ width: "100%", display: "flex", alignItems: "center", border: "1px solid #E5E7EB" }}>
                      <div className="flex items-center space-x-2">
                        <brain >
                        <span className="text-blue-400"></button>AI Analysis</button>
                      </div>
                      {isReflectionExpanded ? (
                        <ChevronUp >
                      ) : (
                        <ChevronDown >
                      )}
                    </button />
                  <collapsiblecontent >
                    <aireflection />
                </Collapsible />
            </ChevronUp>
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
