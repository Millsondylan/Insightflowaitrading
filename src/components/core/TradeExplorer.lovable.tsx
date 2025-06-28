import { useState } from 'react';
import { Trade } from '@/lib/backtest/runBacktest';
import BlockReveal from '@/components/ui/BlockReveal';
import '@/styles/backtest.css';

interface TradeExplorerProps {
  trades: Trade[];
}

const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;
const formatCurrency = (value: number) => value.toFixed(2);
const formatTime = (timestamp: number) => new Date(timestamp * 1000).toLocaleString();
const formatDuration = (start: number, end: number) => {
  const durationMs = (end - start) * 1000;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const TradeExplorer = ({ trades }: TradeExplorerProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const tradesPerPage = 10;
  
  const indexOfLastTrade = currentPage * tradesPerPage;
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;
  const currentTrades = trades.slice(indexOfFirstTrade, indexOfLastTrade);
  const totalPages = Math.ceil(trades.length / tradesPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <BlockReveal>
      <div className="trade-table">
        <Table>
          <TableHeader>
            <TableRow className="trade-table-header">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Entry Time</TableHead>
              <TableHead>Exit Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Entry Price</TableHead>
              <TableHead>Exit Price</TableHead>
              <TableHead>PnL</TableHead>
              <TableHead>PnL %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTrades.map((trade, index) => {
              const isWin = trade.pnl > 0;
              const tradeIndex = indexOfFirstTrade + index + 1;
              
              return (
                <TableRow key={index} className={`trade-row ${isWin ? 'win' : 'loss'}`}>
                  <TableCell className="font-medium">{tradeIndex}</TableCell>
                  <TableCell>{formatTime(trade.entryTime)}</TableCell>
                  <TableCell>{formatTime(trade.exitTime)}</TableCell>
                  <TableCell>{formatDuration(trade.entryTime, trade.exitTime)}</TableCell>
                  <TableCell>{formatCurrency(trade.entryPrice)}</TableCell>
                  <TableCell>{formatCurrency(trade.exitPrice)}</TableCell>
                  <TableCell className={`trade-pnl ${isWin ? 'positive' : 'negative'}`}>
                    {formatCurrency(trade.pnl)}
                  </TableCell>
                  <TableCell className={`trade-pnl ${isWin ? 'positive' : 'negative'}`}>
                    {formatPercent(trade.pnlPercentage)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {totalPages > 1 && (
          <div className="py-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={page === currentPage}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </BlockReveal>
  );
};

export default TradeExplorer; 
// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};
