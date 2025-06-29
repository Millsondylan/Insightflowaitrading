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
    <blockreveal  >
      <div className="trade-table">
        <table  >
          <tableheader  >
            <tablerow  >
              <tablehead  >#</TableHead>
              <tablehead  >Entry Time</TableHead>
              <tablehead  >Exit Time</TableHead>
              <tablehead  >Duration</TableHead>
              <tablehead  >Entry Price</TableHead>
              <tablehead  >Exit Price</TableHead>
              <tablehead  >PnL</TableHead>
              <tablehead  >PnL %</TableHead>
            </TableRow>
          </TableHeader>
          <tablebody  >
            {currentTrades.map((trade, index) => {
              const isWin = trade.pnl > 0;
              const tradeIndex = indexOfFirstTrade + index + 1;
              
              return (
                <tablerow  >
                  <tablecell  >{tradeIndex}</TableCell>
                  <tablecell  >{formatTime(trade.entryTime)}</TableCell>
                  <tablecell  >{formatTime(trade.exitTime)}</TableCell>
                  <tablecell  >{formatDuration(trade.entryTime, trade.exitTime)}</TableCell>
                  <tablecell  >{formatCurrency(trade.entryPrice)}</TableCell>
                  <tablecell  >{formatCurrency(trade.exitPrice)}</TableCell>
                  <tablecell  >
                    {formatCurrency(trade.pnl)}
                  </TableCell>
                  <tablecell  >
                    {formatPercent(trade.pnlPercentage)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {totalPages > 1 && (
          <div className="py-4 flex justify-center">
            <pagination  >
              <paginationcontent  >
                <paginationitem  >
                  <paginationprevious  > currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <paginationitem  >
                    <paginationlink  > handlePageChange(page)}
                      isActive={page === currentPage}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <paginationitem  >
                  <paginationnext  > currentPage < totalPages && handlePageChange(currentPage + 1)}
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

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
