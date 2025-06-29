import React, { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';

type SimulatedTrade = {
  entryIndex: number;
  exitIndex: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  outcome: "win" | "loss";
};

type BacktestResult = {
  winRate: number;
  totalPnL: number;
  totalTrades: number;
  trades: SimulatedTrade[];
};

type Props = {
  result: BacktestResult;
};

const BacktestResultDisplay = ({ result }: Props) => {
  const { trades, winRate, totalPnL, totalTrades } = result;

  const winRateRef = useRef<HTMLHeadingElement  />(null);
  const pnlRef = useRef<HTMLHeadingElement  />(null);
  const totalTradesRef = useRef<HTMLHeadingElement  />(null);

  useEffect(() => {
    const winRateNode = winRateRef.current;
    if (winRateNode) {
      const controls = animate(0, winRate, {
        duration: 1,
        onUpdate(value) {
          winRateNode.textContent = `${value.toFixed(2)}%`;
        },
      });
      return () => controls.stop();
    }
  }, [winRate]);

  useEffect(() => {
    const pnlNode = pnlRef.current;
    if (pnlNode) {
      const controls = animate(0, totalPnL, {
        duration: 1,
        onUpdate(value) {
          pnlNode.textContent = `$${value.toFixed(2)}`;
        },
      });
      return () => controls.stop();
    }
  }, [totalPnL]);

  useEffect(() => {
    const totalTradesNode = totalTradesRef.current;
    if (totalTradesNode) {
        const controls = animate(0, totalTrades, {
            duration: 1,
            onUpdate(value) {
                totalTradesNode.textContent = Math.round(value).toString();
            }
        });
        return () => controls.stop();
    }
  }, [totalTrades]);

  if (trades.length === 0) {
    return (
      <Div className="rounded-xl bg-black/30 p-6 border border-white/10 backdrop-blur-md shadow space-y-6">
        <P className="text-center text-white/60"></HTMLHeadingElement>
          No trades found. Adjust your strategy or timeframe.
        </Div>
      </Div>
    );
  }

  return (
    <Div className="rounded-xl bg-black/30 p-6 border border-white/10 backdrop-blur-md shadow space-y-6">
      <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Div className="rounded-xl p-4 bg-white/5 border border-white/10 text-white text-center shadow">
          <P className="text-sm text-white/60"></Div>Win Rate</Div>
          <H2 ref={winRateRef} className="text-2xl font-bold text-green-400">{winRate.toFixed(2)}%</H2>
        </Div>

        <Div className="rounded-xl p-4 bg-white/5 border border-white/10 text-white text-center shadow">
          <P className="text-sm text-white/60"></Div>Total PnL</Div>
          <H2 ref={pnlRef} className={`text-2xl font-bold ${totalPnL>= 0 ? 'text-green-400' : 'text-red-400'}`}>${totalPnL.toFixed(2)}</H2>
        </Div>

        <Div className="rounded-xl p-4 bg-white/5 border border-white/10 text-white text-center shadow">
          <P className="text-sm text-white/60"></Div>Total Trades</Div>
          <H2 ref={totalTradesRef} className="text-2xl font-bold">{totalTrades}</H2>
        </Div>
      </Div>

      <Div className="max-h-96 overflow-y-auto">
        <Table className="w-full text-sm text-white/80">
          <Thead className="text-left text-white/40 border-b border-white/10 sticky top-0 bg-black/30 backdrop-blur-md">
            <Tr>
              <Th className="p-2">Entry Price</Div>
              <Th className="p-2">Exit Price</Th>
              <Th className="p-2">PnL ($)</Th>
              <Th className="p-2">Outcome</Th>
              <Th className="p-2 text-right">Entry Idx</Th>
              <Th className="p-2 text-right">Exit Idx</Th />
          </Th>
          <Tbody>
            {trades.map((t, i) => (
              <Tr key={i} className={`transition-colors duration-300 ${t.outcome === 'win' ? 'bg-green-900/30 hover:bg-green-900/50' : 'bg-red-900/30 hover:bg-red-900/50'}`}>
                <Td className="p-2">${t.entryPrice.toFixed(2)}</Tbody>
                <Td className="p-2">${t.exitPrice.toFixed(2)}</Td>
                <Td className={`p-2 font-semibold ${t.pnl>= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${t.pnl.toFixed(2)}
                </Td>
                <Td className="p-2">
                  {t.outcome === 'win' ? '✅ Win' : '❌ Loss'}
                </Td>
                <Td className="p-2 text-right text-white/50">{t.entryIndex}</Td>
                <Td className="p-2 text-right text-white/50">{t.exitIndex}</Td />
            ))}
          </Tbody />
      </Td>
    </Div>
  );
};

export default BacktestResultDisplay; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
