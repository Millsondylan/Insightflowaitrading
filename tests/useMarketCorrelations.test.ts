import { renderHook, act } from '@testing-library/react';
import { useMarketCorrelations } from '@/lib/realtime/useMarketCorrelations';

// Mock Supabase client
jest.mock('@/integrations/supabase/client', () => {
  const rows = [{ id: 1, base: 'BTC', quote: 'ETH', timeframe: '30d', correlation: 0.8, updated_at: new Date().toISOString() }];
  const subscribers: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any[] = [];
  return {
    supabase: {
      from: () => ({
        select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: rows, error: null }) }) }),
      }),
      channel: () => ({
        on: (_event: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any, _filter: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any, cb: () => void) => {
          subscribers.push(cb);
          return { subscribe: () => {}, unsubscribe: () => {} };
        },
      }),
    },
  };
});

describe('useMarketCorrelations', () => {
  it('fetches initial data', async () => {
    const { result } = renderHook(() => useMarketCorrelations({ autoSubscribe: false }));
    // wait for state update
    await act(async () => {
      await new Promise(r => setTimeout(r, 0));
    });
    expect(result.current.data.length).toBe(1);
    expect(result.current.loading).toBe(false);
  });
}); 