// Lovable-specific middleware for database connection management
import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client with connection management for Lovable environment
 * @returns {Object} Supabase client
 */
export function createLovableSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://ikreglaqlileqlmlgsao.supabase.co';
  const supabaseKey = process.env.SUPABASE_KEY;
  
  if (!supabaseKey) {
    console.warn('⚠️ SUPABASE_KEY not found in environment variables');
    return {
      from: () => ({
        select: () => ({ data: null, error: new Error('Database connection not available') })
      }),
      auth: {
        signIn: () => Promise.reject(new Error('Auth not available without SUPABASE_KEY')),
        signUp: () => Promise.reject(new Error('Auth not available without SUPABASE_KEY')),
      },
      _isLovableFallback: true
    };
  }
  
  try {
    const client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
    
    // Add connection check method for health monitoring
    client.healthCheck = async () => {
      try {
        const { data, error } = await client.from('health_check').select('*').limit(1);
        return { isConnected: !error, error: error || null };
      } catch (err) {
        return { isConnected: false, error: err };
      }
    };
    
    return client;
  } catch (err) {
    console.error('❌ Failed to create Supabase client:', err);
    
    // Return a fallback client that won't crash the app
    return {
      from: () => ({
        select: () => ({ data: null, error: new Error('Database connection failed') })
      }),
      auth: {
        signIn: () => Promise.reject(new Error('Auth not available - connection failed')),
        signUp: () => Promise.reject(new Error('Auth not available - connection failed')),
      },
      healthCheck: async () => ({ isConnected: false, error: err }),
      _isLovableFallback: true
    };
  }
}

/**
 * Express middleware for managing database connections
 */
export function databaseConnectionMiddleware(req, res, next) {
  // Add database connection status to request object
  req.dbConnected = !!process.env.DATABASE_URL && !!process.env.SUPABASE_KEY;
  
  // For health check endpoints, add detailed info
  if (req.path === '/health' || req.path === '/api/health') {
    req.dbConnectionInfo = {
      url: process.env.DATABASE_URL ? 'Set (hidden)' : 'Not configured',
      supabaseUrl: process.env.SUPABASE_URL || 'Not configured',
      supabaseKey: process.env.SUPABASE_KEY ? 'Set (hidden)' : 'Not configured',
    };
  }
  
  next();
}

/**
 * Express middleware for handling lovable-specific headers and behaviors
 */
export function lovableEnvironmentMiddleware(req, res, next) {
  // Add Lovable-specific headers
  res.setHeader('X-Powered-By', 'InsightFlow-Lovable');
  
  // Add Lovable detection to the request
  req.isLovable = process.env.VITE_IS_LOVABLE === 'true' || 
                  req.hostname.includes('lovable.dev');
  
  // Add debugging information to response on development
  if (process.env.NODE_ENV !== 'production') {
    res.on('finish', () => {
      console.log(`${req.method} ${req.path} - ${res.statusCode}`);
    });
  }
  
  next();
}

/**
 * Error handling middleware specifically for Lovable environment
 */
export function lovableErrorHandler(err, req, res, next) {
  console.error('❌ Lovable Error:', err);
  
  // Don't expose error details in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(err.status || 500).json({
    error: {
      message: isProduction ? 'Server error' : err.message,
      status: err.status || 500,
      code: err.code || 'SERVER_ERROR',
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Function to test database connection for health checks
 * @returns {Promise<Object>} Connection status
 */
export async function testDatabaseConnection() {
  try {
    const client = createLovableSupabaseClient();
    return await client.healthCheck();
  } catch (error) {
    return { isConnected: false, error };
  }
}

export default {
  createLovableSupabaseClient,
  databaseConnectionMiddleware,
  lovableEnvironmentMiddleware,
  lovableErrorHandler,
  testDatabaseConnection
}; 