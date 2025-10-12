#!/bin/bash
echo "Installing Python requirements..."
pip install -r requirements.txt

echo "Installing Playwright system dependencies..."
playwright install-deps

echo "Installing Playwright browsers..."
playwright install chromium

echo "Build complete!"
