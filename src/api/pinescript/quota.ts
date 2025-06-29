import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';
import { checkPineScriptQuota } from '@/lib/pinescript/generator';
import { getAuthenticatedUser } from '@/lib/auth/sessionHandler';

export const config = {
  runtime: 'edge',
  regions: ['iad1'],
};

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check quota
    const quota = await checkPineScriptQuota(user.id);
    
    // Return quota info
    return NextResponse.json(quota);
    
  } catch (error: any) {
    console.error('Error checking Pine Script quota:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check Pine Script quota' },
      { status: 500 }
    );
  }
} 