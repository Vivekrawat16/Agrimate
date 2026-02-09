# AWS EC2 Deployment Guide for Agrimat

This guide walks you through deploying the Agrimat application to an AWS EC2 instance (Ubuntu/Amazon Linux).

## Prerequisites
- An AWS Account.
- A running EC2 instance (t2.micro is sufficient for testing).
- SSH access to your instance.
- Domains (optional) if you want `https://your-domain.com`.

## 1. Prepare the Server

SSH into your EC2 instance:
```bash
ssh -i "your-key.pem" ubuntu@your-ec2-ip
```

Update packages and install dependencies (Node.js, NPM, Git):
```bash
sudo apt update
sudo apt install -y nodejs npm git
# Or use NVM to install a specific Node version (Recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

Install PM2 (Process Manager) globally:
```bash
npm install -g pm2
```

## 2. Clone the Repository

Clone your project repository:
```bash
git clone https://github.com/your-username/Agrimat.git
cd Agrimat
```
*(If your repo is private, you may need to set up SSH keys or use a token)*

## 3. Install Dependencies & Build

Install backend dependencies:
```bash
cd backend
npm install
```

Install frontend dependencies and build (if not committed):
```bash
cd ../frontend
npm install
npm run build
```
*Note: We already configured `backend/server.js` to serve the `frontend/dist` folder.*

## 4. Environment Variables

Create the `.env` file in the `backend` directory:
```bash
cd ../backend
nano .env
```
Paste your production variables:
```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_ai_api_key
WEATHER_API_KEY=your_weather_api_key
```
Save and exit (`Ctrl+X` -> `Y` -> `Enter`).

## 5. Start the Application with PM2

Start the backend server:
```bash
pm2 start server.js --name "agrimat"
```

Save the PM2 process list so it restarts on reboot:
```bash
pm2 save
pm2 startup
# Run the command output by pm2 startup
```

## 6. Configure Nginx (Optional but Recommended)

Install Nginx to reverse proxy port 80 to 5000:
```bash
sudo apt install -y nginx
```

Edit the default configuration:
```bash
sudo nano /etc/nginx/sites-available/default
```

Replace the `location /` block with:
```nginx
location / {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

## Verification
Visit `http://your-ec2-ip` in your browser. You should see the Agrimat application running!
