import { validatePayload } from '@/lib/validation/jsonValidator';
import { describe, it, expect, jest } from '@jest/globals';

jest.mock('@/integrations/supabase/client', () => {
  const rows: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any[] = [{ schema: { type: 'object', properties: { foo: { type: 'string' } }, required: ['foo'] } }];
  return {
    supabase: {
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: rows[0], error: null }) }) }),
      }),
    },
  };
});

jest.mock('@/lib/monitoring/auditWebhook', () => ({ captureAudit: jest.fn() }));

describe('jsonValidator', () => {
  it('returns true for valid payload', async () => {
    const result = await validatePayload('testSchema', { foo: 'bar' });
    expect(result).toBe(true);
  });

  it('returns false for invalid payload', async () => {
    const result = await validatePayload('testSchema', { foo: 123 });
    expect(result).toBe(false);
  });
}); 