// Ultra-minimal Express server for Lovable
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

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
  </style>
</head>
<body>
  <div class="container">
    <h1>InsightFlow AI Trading</h1>
    <p>This is the emergency fallback page for Lovable deployment.</p>
    <p>Server time: ${new Date().toLocaleString()}</p>
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

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    hostname: req.hostname
  });
});

// Serve the fallback HTML for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server directory: ${__dirname}`);
  console.log(`Serving static content from: ${path.join(__dirname, 'public')}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
}); 