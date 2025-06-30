import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/sessionHandler';
import { generateCorrelationMatrix } from '@/lib/markets/market-correlation';
import { supabase } from '@/integrations/supabase/client';

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
    
    const { assets, timePeriod } = body;
    
    if (!assets || !Array.isArray(assets) || assets.length === 0) {
      return NextResponse.json(
        { error: 'Assets array is required and must not be empty' },
        { status: 400 }
      );
    }
    
    if (!timePeriod || !['1d', '7d', '30d', '90d', '1y'].includes(timePeriod)) {
      return NextResponse.json(
        { error: 'Valid timePeriod is required (1d, 7d, 30d, 90d, 1y)' },
        { status: 400 }
      );
    }
    
    // Generate correlation matrix
    const correlationMatrix = await generateCorrelationMatrix(assets, timePeriod);
    
    // Save to cache in database if possible
    try {
      await supabase
        .from('market_correlations_cache')
        .upsert({
          asset_set: JSON.stringify(assets.sort()),
          timeframe: timePeriod,
          correlation_data: correlationMatrix,
          last_updated: new Date().toISOString()
        }, { onConflict: 'asset_set,timeframe' });
    } catch (cacheError) {
      // Log but don't fail the request if caching fails
      console.error('Failed to cache correlation data:', cacheError);
    }
    
    // Return correlation matrix
    return NextResponse.json({
      success: true,
      data: correlationMatrix
    });
    
  } catch (error: any) {
    console.error('Error generating correlation matrix:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate correlation matrix' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse query parameters
    const url = new URL(req.url);
    const assets = url.searchParams.get('assets');
    const timePeriod = url.searchParams.get('timePeriod');
    
    if (!assets) {
      return NextResponse.json(
        { error: 'Assets parameter is required (comma-separated list)' },
        { status: 400 }
      );
    }
    
    if (!timePeriod || !['1d', '7d', '30d', '90d', '1y'].includes(timePeriod)) {
      return NextResponse.json(
        { error: 'Valid timePeriod is required (1d, 7d, 30d, 90d, 1y)' },
        { status: 400 }
      );
    }
    
    const assetsList = assets.split(',').map(a => a.trim());
    
    if (assetsList.length === 0) {
      return NextResponse.json(
        { error: 'At least one asset must be specified' },
        { status: 400 }
      );
    }
    
    // Try to get from cache first
    const { data: cacheData, error: cacheError } = await supabase
      .from('market_correlations_cache')
      .select('correlation_data, last_updated')
      .eq('asset_set', JSON.stringify(assetsList.sort()))
      .eq('timeframe', timePeriod)
      .single();
    
    // If cache is fresh (less than 1 hour old), use it
    if (!cacheError && cacheData) {
      const cacheAge = Date.now() - new Date(cacheData.last_updated).getTime();
      if (cacheAge < 3600000) { // 1 hour in milliseconds
        return NextResponse.json({
          success: true,
          data: cacheData.correlation_data,
          fromCache: true
        });
      }
    }
    
    // Generate new correlation matrix
    const correlationMatrix = await generateCorrelationMatrix(assetsList, timePeriod);
    
    // Save to cache
    try {
      await supabase
        .from('market_correlations_cache')
        .upsert({
          asset_set: JSON.stringify(assetsList.sort()),
          timeframe: timePeriod,
          correlation_data: correlationMatrix,
          last_updated: new Date().toISOString()
        }, { onConflict: 'asset_set,timeframe' });
    } catch (cacheError) {
      // Log but don't fail the request
      console.error('Failed to cache correlation data:', cacheError);
    }
    
    // Return correlation matrix
    return NextResponse.json({
      success: true,
      data: correlationMatrix,
      fromCache: false
    });
    
  } catch (error: any) {
    console.error('Error fetching correlation data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch correlation data' },
      { status: 500 }
    );
  }
} 