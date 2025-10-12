#!/bin/bash

echo "🌐 Exposing local AgentQL server to the internet"
echo "=============================================="
echo ""
echo "Make sure your Flask server is running on http://localhost:8000"
echo "Using your static domain: lidia-apogeotropic-tracey.ngrok-free.dev"
echo ""

# Start ngrok tunnel with your static domain
ngrok http --domain=lidia-apogeotropic-tracey.ngrok-free.dev 8000
