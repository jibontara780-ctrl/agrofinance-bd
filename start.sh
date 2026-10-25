#!/bin/bash
echo "🌾 Starting AgroFinance BD - MERN Investment Management System..."
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

export PORT=5001
export NODE_PATH="$DIR/server/node_modules"

echo "📡 Server starting at: http://localhost:5001"
echo "🌐 Open your browser and navigate to: http://localhost:5001"
node server/server.js
