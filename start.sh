#!/bin/bash

# Cytoscape Playground - Local Development Server
# This script starts a simple HTTP server for local development

echo "🚀 Starting Cytoscape Playground..."
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "✅ Using Python 3"
    echo "📡 Server running at: http://localhost:8000"
    echo "🌐 Open your browser and visit the URL above"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8000
# Check if Python 2 is available
elif command -v python &> /dev/null; then
    echo "✅ Using Python 2"
    echo "📡 Server running at: http://localhost:8000"
    echo "🌐 Open your browser and visit the URL above"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python -m SimpleHTTPServer 8000
# Check if Node.js is available
elif command -v node &> /dev/null; then
    echo "✅ Using Node.js"
    echo "📦 Installing http-server..."
    npx http-server -p 8000
else
    echo "❌ Error: No suitable HTTP server found"
    echo ""
    echo "Please install one of the following:"
    echo "  - Python 3: https://www.python.org/downloads/"
    echo "  - Node.js: https://nodejs.org/"
    echo ""
    echo "Or simply open index.html directly in your browser"
    exit 1
fi

