#!/bin/bash
echo "=== PULSE News Setup ==="
echo ""
echo "[1/2] Installing frontend deps..."
cd client && npm install && cd ..
echo "[2/2] Installing backend deps..."
cd server && npm install && cd ..
echo ""
echo "✓ Done! Next steps:"
echo "  1. Edit server/.env — set MONGO_URI + OAuth keys"
echo "  2. Terminal A: cd server && npm run dev"
echo "  3. Terminal B: cd client && npm run dev"
echo "  4. Open: http://localhost:3000"
echo ""
echo "  Tip: Frontend runs with mock data by default (no backend needed)"
echo "       To use real data set VITE_USE_MOCK=false in client/.env"
