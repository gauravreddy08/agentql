#!/bin/bash
cd /Users/gaurxvreddy/agentql/frontend
echo "https://web-production-404b8.up.railway.app" | vercel env add REACT_APP_API_URL production
