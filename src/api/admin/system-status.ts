import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';
import { config } from '@/lib/config';
import { getSessionUser } from '@/lib/auth/sessionHandler';

// Simple cache so we don't hammer the DB when this endpoint is polled often
let lastPayload: any = null;
let lastGeneratedAt = 0;

const CACHE_MS = 30_000; // 30s

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only GET supported
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple auth check – must be admin or developer_mode header
  const user = await getSessionUser(req, res);
  const developerMode = req.headers['x-developer-mode'] === 'true';

  if (!user?.is_admin && !developerMode) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Serve cached payload if recent
  if (Date.now() - lastGeneratedAt < CACHE_MS && lastPayload) {
    return res.status(200).json(lastPayload);
  }

  // Build status payload (mirror panel logic but with true DB queries)
  try {
    // ping DB
    const dbStart = Date.now();
    const { error: dbError } = await supabase.rpc('ping');
    const dbLatency = Date.now() - dbStart;

    const services: any[] = [
      {
        name: 'Database',
        status: dbError ? 'down' : 'healthy',
        latency: dbLatency,
        lastCheck: new Date().toISOString(),
      },
    ];

    // TODO: optionally include AI / market provider checks by hitting inexpensive status endpoints

    // gather sync times from a helper view (or approximate)
    const { data: syncTimes } = await supabase.from('table_sync_metadata').select('*');

    const payload = {
      generatedAt: new Date().toISOString(),
      services,
      lastSyncTimes: syncTimes || {},
    };

    lastGeneratedAt = Date.now();
    lastPayload = payload;

    return res.status(200).json(payload);
  } catch (error) {
    console.error('system-status handler error', error);
    return res.status(500).json({ error: 'internal_error' });
  }
} 