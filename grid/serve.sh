#!/bin/bash
# Simple script to serve the grid visualization with a local web server

echo "Starting local web server..."
echo "Open your browser to: http://localhost:8000/grid.html"
echo "Press Ctrl+C to stop the server"
echo ""

cd "$(dirname "$0")"
python3 -m http.server 8000

