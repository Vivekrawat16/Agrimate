#!/bin/bash

# Update and Install Essentials
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential

# Install Node.js (v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Setup Project (assuming git clone is done)
echo "Installing Backend Dependencies..."
cd backend
npm install
cd ..

echo "Installing Frontend Dependencies & Building..."
cd frontend
npm install
npm run build
cd ..

# Start App
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "✅ Setup Complete! App should be running on port 5000."
