#!/bin/bash
echo "Installing Python requirements..."
pip install -r requirements.txt

echo "Installing Playwright browsers..."
playwright install chromium

echo "Build complete!"
