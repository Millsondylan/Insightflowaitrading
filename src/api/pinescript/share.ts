import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';
import { createPineScriptShare } from '@/lib/pinescript/generator';
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
      pineScriptId,
      isPublic = false,
      expiresInDays
    } = body;
    
    // Validate required fields
    if (!pineScriptId) {
      return NextResponse.json(
        { error: 'Missing required field: pineScriptId' },
        { status: 400 }
      );
    }
    
    // Create share
    const shareToken = await createPineScriptShare(
      pineScriptId,
      user.id,
      isPublic,
      expiresInDays
    );
    
    // Construct share URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://insightflow.ai';
    const shareUrl = `${baseUrl}/pinescript/shared/${shareToken}`;
    
    // Return share info
    return NextResponse.json({
      success: true,
      shareUrl,
      shareToken
    });
    
  } catch (error: any) {
    console.error('Error creating Pine Script share:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Pine Script share' },
      { status: 500 }
    );
  }
} 