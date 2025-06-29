import { useState } from 'react';
import { Trade } from '@/lib/backtest/runBacktest';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
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
    <blockReveal>
      <Div className="trade-table">
        <Table>
          <tableHeader>
            <tableRow className="trade-table-header">
              <tableHead className="w-12">#</Div>
              <tableHead>Entry Time</TableHead>
              <tableHead>Exit Time</TableHead>
              <tableHead>Duration</TableHead>
              <tableHead>Entry Price</TableHead>
              <tableHead>Exit Price</TableHead>
              <tableHead>PnL</TableHead>
              <tableHead>PnL %</TableHead>
            </TableRow>
          </TableHeader>
          <tableBody>
            {currentTrades.map((trade, index) => {
              const isWin = trade.pnl > 0;
              const tradeIndex = indexOfFirstTrade + index + 1;
              
              return (
                <tableRow key={index} className={`trade-row ${isWin ? 'win' : 'loss'}`}>
                  <tableCell className="font-medium">{tradeIndex}</TableCell>
                  <tableCell>{formatTime(trade.entryTime)}</TableCell>
                  <tableCell>{formatTime(trade.exitTime)}</TableCell>
                  <tableCell>{formatDuration(trade.entryTime, trade.exitTime)}</TableCell>
                  <tableCell>{formatCurrency(trade.entryPrice)}</TableCell>
                  <tableCell>{formatCurrency(trade.exitPrice)}</TableCell>
                  <tableCell className={`trade-pnl ${isWin ? 'positive' : 'negative'}`}>
                    {formatCurrency(trade.pnl)}
                  </TableCell>
                  <tableCell className={`trade-pnl ${isWin ? 'positive' : 'negative'}`}>
                    {formatPercent(trade.pnlPercentage)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {totalPages > 1 && (
          <Div className="py-4 flex justify-center">
            <pagination>
              <paginationContent>
                <paginationItem>
                  <paginationPrevious 
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  />
                </Div>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <paginationItem key={page}>
                    <paginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={page === currentPage}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <paginationItem>
                  <paginationNext
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Div>
        )}
      </Div>
    </BlockReveal>
  );
};

export default TradeExplorer;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 