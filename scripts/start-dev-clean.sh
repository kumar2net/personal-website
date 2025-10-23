#!/bin/bash
# Clean Dev Server Startup Script
# Automatically kills processes on ports 8888 and 5173 before starting dev server

echo "🧹 Cleaning up ports..."

# Kill any process on port 8888 (Netlify Dev)
if lsof -ti:8888 >/dev/null 2>&1; then
  echo "  ⚠️  Port 8888 is in use, killing process..."
  lsof -ti:8888 | xargs kill -9 2>/dev/null || true
  echo "  ✅ Port 8888 freed"
else
  echo "  ✅ Port 8888 is free"
fi

# Kill any process on port 5173 (Vite)
if lsof -ti:5173 >/dev/null 2>&1; then
  echo "  ⚠️  Port 5173 is in use, killing process..."
  lsof -ti:5173 | xargs kill -9 2>/dev/null || true
  echo "  ✅ Port 5173 freed"
else
  echo "  ✅ Port 5173 is free"
fi

echo ""
echo "🚀 Starting dev server..."
echo ""

# Start the dev server with memory optimization
NODE_OPTIONS='--max-old-space-size=4096' vite --open

