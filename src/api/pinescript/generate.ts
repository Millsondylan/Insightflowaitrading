import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';
import { generatePineScript, checkPineScriptQuota } from '@/lib/pinescript/generator';
import { getAuthenticatedUser } from '@/lib/auth/sessionHandler';

export const config = {
  runtime: 'edge',
  regions: ['iad1'],
};

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body
    const body = await req.json();
    const {
      prompt,
      scriptType,
      timeframe,
      additionalContext
    } = body;
    
    // Validate required fields
    if (!prompt || !scriptType) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt and scriptType are required' },
        { status: 400 }
      );
    }
    
    // Check user's quota
    const quota = await checkPineScriptQuota(user.id);
    
    if (quota.isLimited && quota.remaining <= 0) {
      return NextResponse.json(
        { error: 'Monthly Pine Script generation limit reached. Please upgrade to continue.' },
        { status: 403 }
      );
    }
    
    // Generate Pine Script
    const result = await generatePineScript({
      prompt,
      userId: user.id,
      scriptType,
      timeframe,
      additionalContext,
    });
    
    // Return the generated code
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('Error generating Pine Script:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate Pine Script' },
      { status: 500 }
    );
  }
} 