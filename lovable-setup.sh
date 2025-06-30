#!/bin/bash

echo "🚀 Setting up minimal deployment for Lovable..."

# Create public directory if it doesn't exist
mkdir -p public

# Copy fallback HTML to public directory
echo "📋 Copying fallback HTML..."
cp client/public/lovable-fallback.html public/index.html

echo "✅ Setup complete! Use 'npm run minimal-start' to run the server." 