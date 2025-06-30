// Ultra-minimal Express server for Lovable
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Lovable-specific middleware if available
let lovableMiddleware;
try {
  lovableMiddleware = await import('./server/lovable-middleware.js').catch(() => null);
} catch (err) {
  console.log('Lovable middleware not found, continuing with basic setup');
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Check for essential environment variables
const checkEnvironment = () => {
  console.log('Checking environment variables...');
  
  const requiredVars = {
    'DATABASE_URL': process.env.DATABASE_URL || '❌ Not set',
    'NODE_ENV': process.env.NODE_ENV || 'development',
    'PORT': process.env.PORT || '3000 (default)'
  };
  
  const optionalVars = {
    'SUPABASE_URL': process.env.SUPABASE_URL || '❌ Not set',
    'SUPABASE_KEY': process.env.SUPABASE_KEY?.substring(0, 8) + '...' || '❌ Not set',
    'VITE_IS_LOVABLE': process.env.VITE_IS_LOVABLE || '❌ Not set'
  };
  
  console.log('Required environment variables:');
  Object.entries(requiredVars).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  console.log('Optional environment variables:');
  Object.entries(optionalVars).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️ WARNING: DATABASE_URL is not set. Database features will not work.');
  }
};

// Simple fallback HTML if needed
const fallbackHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>InsightFlow AI Trading</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      background-color: #111;
      color: white;
      margin: 0;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      max-width: 600px;
      text-align: center;
    }
    h1 {
      background: linear-gradient(135deg, #00b4db, #0083b0);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      margin-right: 8px;
    }
    .badge.success {
      background-color: rgba(0, 200, 0, 0.2);
      color: #4caf50;
    }
    .badge.warning {
      background-color: rgba(255, 180, 0, 0.2);
      color: #ff9800;
    }
    .badge.error {
      background-color: rgba(255, 0, 0, 0.2);
      color: #f44336;
    }
    .detail {
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      padding: 12px;
      margin-top: 16px;
      text-align: left;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>InsightFlow AI Trading</h1>
    <p>This is the emergency fallback page for Lovable deployment.</p>
    <div>
      <span class="badge ${process.env.DATABASE_URL ? 'success' : 'error'}">
        Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not Connected'}
      </span>
      <span class="badge ${process.env.NODE_ENV === 'production' ? 'success' : 'warning'}">
        Environment: ${process.env.NODE_ENV || 'development'}
      </span>
    </div>
    <p>Server time: ${new Date().toLocaleString()}</p>
    
    <div class="detail">
      <p><strong>Troubleshooting:</strong></p>
      <ul>
        <li>Check if DATABASE_URL is properly set in environment variables</li>
        <li>Verify NODE_ENV is set to 'production'</li>
        <li>Ensure all required dependencies are installed</li>
      </ul>
    </div>
  </div>
</body>
</html>`;

// Setup function
function setupServer() {
  // Ensure the public directory exists
  const publicDir = path.join(__dirname, 'public');
  try {
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Check if we have an index.html file, create it if not
    const indexPath = path.join(publicDir, 'index.html');
    const clientFallbackPath = path.join(__dirname, 'client', 'public', 'lovable-fallback.html');
    
    if (!fs.existsSync(indexPath)) {
      // Try to copy from client/public/lovable-fallback.html
      if (fs.existsSync(clientFallbackPath)) {
        fs.copyFileSync(clientFallbackPath, indexPath);
        console.log('✅ Copied fallback HTML from client directory');
      } else {
        // Create emergency fallback HTML
        fs.writeFileSync(indexPath, fallbackHTML);
        console.log('⚠️ Created emergency fallback HTML');
      }
    }
    
    console.log('✅ Server setup complete');
  } catch (error) {
    console.error('❌ Setup error:', error);
    
    // Last resort - create an index.html in the current directory
    try {
      fs.writeFileSync(path.join(__dirname, 'index.html'), fallbackHTML);
      console.log('🔄 Created emergency index.html in root directory');
    } catch (e) {
      console.error('💥 Critical failure:', e);
    }
  }
}

// Run setup at startup
setupServer();
checkEnvironment();

// Apply Lovable middleware if available
if (lovableMiddleware) {
  app.use(lovableMiddleware.lovableEnvironmentMiddleware);
  app.use(lovableMiddleware.databaseConnectionMiddleware);
  console.log('✅ Lovable middleware applied');
}

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Simple health check endpoint
app.get('/health', async (req, res) => {
  // Check database connection if middleware is available
  let dbStatus = { isConnected: false, error: null };
  if (lovableMiddleware) {
    dbStatus = await lovableMiddleware.testDatabaseConnection();
  }
  
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    database: {
      connected: dbStatus.isConnected,
      url_configured: !!process.env.DATABASE_URL,
      error: dbStatus.isConnected ? null : (dbStatus.error?.message || 'Not connected')
    },
    hostname: req.hostname,
    version: '1.0.0',
    middleware_enabled: !!lovableMiddleware
  });
});

// Add a special admin endpoint to view environment status (accessible only on localhost)
app.get('/admin/status', (req, res) => {
  const isLocalhost = req.hostname === 'localhost' || req.ip === '127.0.0.1' || req.ip === '::1';
  
  if (isLocalhost) {
    res.json({
      server: {
        time: new Date().toISOString(),
        nodeEnv: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 3000
      },
      database: {
        connected: !!process.env.DATABASE_URL,
        url: process.env.DATABASE_URL ? 'Set (hidden for security)' : 'Not set'
      },
      environment: {
        lovable: process.env.VITE_IS_LOVABLE === 'true'
      }
    });
  } else {
    res.status(403).json({ error: 'Access denied' });
  }
});

// Serve the fallback HTML for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware (always last)
if (lovableMiddleware) {
  app.use(lovableMiddleware.lovableErrorHandler);
} else {
  app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).send('Server error');
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`✨ Server running on port ${PORT}`);
  console.log(`📂 Server directory: ${__dirname}`);
  console.log(`🌐 Serving static content from: ${path.join(__dirname, 'public')}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Database connection: ${process.env.DATABASE_URL ? 'Available' : 'Not configured'}`);
}); 