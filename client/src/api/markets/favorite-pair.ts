import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/sessionHandler';
import { toggleFavoritePair } from '@/lib/markets/market-correlation';

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
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    const { baseAsset, quoteAsset } = body;
    
    if (!baseAsset || !quoteAsset) {
      return NextResponse.json(
        { error: 'baseAsset and quoteAsset are required' },
        { status: 400 }
      );
    }
    
    // Toggle favorite status
    const isFavorite = await toggleFavoritePair(user.id, baseAsset, quoteAsset);
    
    return NextResponse.json({
      success: true,
      isFavorite
    });
    
  } catch (error: any) {
    console.error('Error toggling favorite pair:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to toggle favorite pair' },
      { status: 500 }
    );
  }
} 