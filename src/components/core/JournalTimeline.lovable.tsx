
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { JournalEntry } from "@/lib/journal/schema";
import AIReflection from "./AIReflection";
import { cn } from "@/lib/utils";

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
      <div style={{ width: "100%", paddingTop: "32px", paddingBottom: "32px" }}>
        <p >Loading journal entries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: "100%", paddingTop: "32px", paddingBottom: "32px" }}>
        <p >Error: {error}</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div style={{ width: "100%" }}>
        <p style={{ color: "#9CA3AF" }}>No journal entries yet. Create your first trade journal entry above!</p>
      </div>
    );
  }

  return (
    <div >
      {entries.map((entry, index) => {
        const profitLoss = calculateProfitLoss(entry);
        const isProfitable = profitLoss > 0;
        const isReflectionExpanded = expandedReflections.has(entry.id);

        return (
          <div
            key={entry.id}
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
            }}
          >
            <Card >
              <div
                className={cn(
                  "border-t-4 -mt-0.5",
                  entry.sentiment === "Bullish"
                    ? "border-green-500"
                    : "border-red-500"
                )}
              />
              <CardHeader style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium",
                      entry.sentiment === "Bullish"
                        ? "bg-green-600/20 text-green-500 border-green-500/30"
                        : "bg-red-600/20 text-red-500 border-red-500/30"
                    )}
                  >
                    {entry.sentiment}
                  </Badge>
                  <span style={{ color: "#9CA3AF" }}>{formatDate(entry.createdAt)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium",
                      isProfitable
                        ? "bg-green-600/20 text-green-500 border-green-500/30"
                        : "bg-red-600/20 text-red-500 border-red-500/30"
                    )}
                  >
                    {isProfitable ? "+" : ""}{profitLoss.toFixed(2)}%
                  </Badge>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleReflection(entry.id)}
                    
                  >
                    <span style={{fontSize: '16px'}}>🧠</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent >
                <h3 >{entry.title}</h3>
                
                <div style={{ display: "flex", marginBottom: "16px" }}>
                  <div>
                    <span style={{ color: "#9CA3AF" }}>Pair:</span>
                    <span >{entry.pair}</span>
                  </div>
                  <div>
                    <span style={{ color: "#9CA3AF" }}>Timeframe:</span>
                    <span >{entry.timeframe}</span>
                  </div>
                </div>
                
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ color: "#9CA3AF" }}>Entry</span>
                    <span >{entry.entryPrice}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ color: "#9CA3AF" }}>Exit</span>
                    <span >{entry.exitPrice}</span>
                  </div>
                </div>
                
                {entry.reason && (
                  <div >
                    <p >{entry.reason}</p>
                  </div>
                )}
                
                {entry.chartUrl && (
                  <div style={{ width: "100%" }}>
                    <img 
                      src={entry.chartUrl} 
                      alt="Trade chart" 
                      style={{ width: "100%" }}
                    />
                  </div>
                )}
                
                {entry.tags && entry.tags.length > 0 && (
                  <div style={{ display: "flex" }}>
                    {entry.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Collapsible open={isReflectionExpanded} onOpenChange={() => toggleReflection(entry.id)}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      style={{ width: "100%", display: "flex", alignItems: "center", border: "1px solid #374151" }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{fontSize: '16px'}}>🧠</span>
                        <span >AI Analysis</span>
                      </div>
                      {isReflectionExpanded ? (
                        <ChevronUp  />
                      ) : (
                        <ChevronDown  />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent >
                    <AIReflection 
                      entry={entry} 
                      autoGenerate={false}
                      
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
