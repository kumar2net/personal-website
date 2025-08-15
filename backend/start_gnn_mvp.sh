#!/bin/bash

echo "🧠 Neural Graph Recommender MVP Setup"
echo "=================================="

# Check if Python 3.8+ is available
python_cmd=""
if command -v python3 &> /dev/null; then
    python_cmd="python3"
elif command -v python &> /dev/null; then
    python_cmd="python"
else
    echo "❌ Python not found. Please install Python 3.8+"
    exit 1
fi

echo "✅ Python found: $python_cmd"

# Check Python version
python_version=$($python_cmd --version 2>&1)
echo "📋 $python_version"

# Install dependencies
echo "📦 Installing dependencies..."
$python_cmd -m pip install -r requirements.txt

echo ""
echo "🧪 Running GNN Test..."
$python_cmd test_gnn.py

if [ $? -eq 0 ]; then
    echo ""
    echo "🚀 Starting FastAPI server..."
    echo "📍 Server will be available at: http://localhost:8000"
    echo "📖 API docs: http://localhost:8000/docs"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    
    $python_cmd -m uvicorn gnn_server:app --host 0.0.0.0 --port 8000 --reload
else
    echo "❌ GNN test failed. Please check the error messages above."
    exit 1
fi