type Trade = {
  entryTime: string;
};

export function groupTradesByDay(trades: Trade[]): Record<string, Trade[]> {
  // First, sort all trades by entryTime descending
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime()
  );

  // Group trades by date (YYYY-MM-DD format)
  const grouped = sortedTrades.reduce((acc, trade) => {
    const dateKey = new Date(trade.entryTime).toISOString().slice(0, 10);
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    
    acc[dateKey].push(trade);
    return acc;
  }, {} as Record<string, Trade[]>);

  return grouped;
} 