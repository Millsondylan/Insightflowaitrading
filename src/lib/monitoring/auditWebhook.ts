import { supabase } from '@/integrations/supabase/client';

const WEBHOOK_URL = process.env.AUDIT_WEBHOOK_URL;

export async function captureAudit(module: string, level: 'info' | 'warn' | 'error', message: string, context?: Record<string, any>) {
  try {
    // Insert into DB (ignore failure)
    await supabase.from('module_error_logs' as any).insert({
      module,
      error_level: level,
      message,
      context,
    });
  } catch (err) {
    console.error('Failed to insert audit log', err);
  }

  if (WEBHOOK_URL) {
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module, level, message, context }),
      });
    } catch (err) {
      console.error('Failed to send audit webhook', err);
    }
  }
} 