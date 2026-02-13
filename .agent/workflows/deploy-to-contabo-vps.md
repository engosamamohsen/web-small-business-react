---
description: Deploy Astro project to Contabo VPS
---

# Deploy Astro E-Commerce Platform to Contabo VPS

This guide walks you through deploying your Astro-based e-commerce platform to a Contabo VPS server.

## Prerequisites

- Contabo VPS with Ubuntu 20.04+ or Debian 11+
- SSH access to your VPS
- Domain name (optional but recommended)
- Root or sudo access

---

## Part 1: Prepare Your VPS

### 1.1 Connect to Your VPS via SSH

```bash
ssh root@your-vps-ip-address
```

### 1.2 Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Install Node.js 18+ (Required for Astro)

```bash
# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### 1.4 Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### 1.5 Install Nginx (Reverse Proxy)

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 1.6 Install Git

```bash
sudo apt install -y git
```

---

## Part 2: Upload Your Project to VPS

### Option A: Using Git (Recommended)

#### 2A.1 Push Your Code to GitHub/GitLab

On your local machine:

```bash
cd "f:\react js projects\web-small-business-react"

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Add your remote repository
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

#### 2A.2 Clone on VPS

On your VPS:

```bash
# Create directory for your app
sudo mkdir -p /var/www/astro-ecommerce
cd /var/www/astro-ecommerce

# Clone your repository
git clone https://github.com/yourusername/your-repo.git .

# Or if using private repo with SSH key
git clone git@github.com:yourusername/your-repo.git .
```

### Option B: Using SCP/SFTP (Direct Upload)

On your local machine (Windows PowerShell):

```powershell
# Compress your project (excluding node_modules)
# First, ensure node_modules is in .gitignore

# Using WinSCP or FileZilla:
# 1. Connect to your VPS via SFTP
# 2. Upload the entire project folder to /var/www/astro-ecommerce
```

Or using SCP from PowerShell:

```powershell
# Create a zip file first (excluding node_modules)
Compress-Archive -Path "f:\react js projects\web-small-business-react\*" -DestinationPath astro-project.zip -Force

# Upload to VPS
scp astro-project.zip root@your-vps-ip:/var/www/
```

Then on VPS:

```bash
cd /var/www
unzip astro-project.zip -d astro-ecommerce
cd astro-ecommerce
```

---

## Part 3: Configure Your Application

### 3.1 Install Dependencies

```bash
cd /var/www/astro-ecommerce
npm install
```

### 3.2 Create Environment File

```bash
cp .env.example .env
nano .env
```

Update with your production values:

```env
# API Configuration
PUBLIC_API_URL=https://api.example.com

# Site Configuration  
PUBLIC_SITE_URL=https://yourdomain.com

# Firebase (Optional)
PUBLIC_FIREBASE_API_KEY=your-key
PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
PUBLIC_FIREBASE_PROJECT_ID=your-project
PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
PUBLIC_FIREBASE_APP_ID=your-app-id

# Multi-tenant (Optional)
PUBLIC_SUBDOMAIN=store-name
```

Save with `Ctrl+X`, then `Y`, then `Enter`.

### 3.3 Build the Application

```bash
npm run build
```

This creates the `dist/` directory with your production build.

---

## Part 4: Configure PM2 to Run Your App

### 4.1 Create PM2 Ecosystem File

```bash
nano ecosystem.config.js
```

Add this configuration:

```javascript
module.exports = {
  apps: [{
    name: 'astro-ecommerce',
    script: 'node',
    args: './dist/server/entry.mjs',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

### 4.2 Create Logs Directory

```bash
mkdir -p logs
```

### 4.3 Start the Application with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Follow the instructions from `pm2 startup` to enable auto-start on reboot.

### 4.4 Verify Application is Running

```bash
pm2 status
pm2 logs astro-ecommerce
```

Test locally:

```bash
curl http://localhost:3000
```

---

## Part 5: Configure Nginx as Reverse Proxy

### 5.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/astro-ecommerce
```

Add this configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name yourdomain.com www.yourdomain.com;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Static files from dist/client
    location /_astro/ {
        alias /var/www/astro-ecommerce/dist/client/_astro/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location /assets/ {
        alias /var/www/astro-ecommerce/dist/client/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Proxy to Node.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Logging
    access_log /var/log/nginx/astro-ecommerce.access.log;
    error_log /var/log/nginx/astro-ecommerce.error.log;
}
```

### 5.2 Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/astro-ecommerce /etc/nginx/sites-enabled/
```

### 5.3 Test Nginx Configuration

```bash
sudo nginx -t
```

### 5.4 Restart Nginx

```bash
sudo systemctl restart nginx
```

---

## Part 6: Configure Domain (Optional)

### 6.1 Point Your Domain to VPS

In your domain registrar's DNS settings:

- **A Record**: `@` → `your-vps-ip-address`
- **A Record**: `www` → `your-vps-ip-address`

Wait 5-60 minutes for DNS propagation.

### 6.2 Install SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts
# Choose option 2 to redirect HTTP to HTTPS
```

Certbot will automatically update your Nginx configuration.

### 6.3 Test Auto-Renewal

```bash
sudo certbot renew --dry-run
```

---

## Part 7: Configure Firewall

### 7.1 Install UFW (if not installed)

```bash
sudo apt install -y ufw
```

### 7.2 Configure Firewall Rules

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## Part 8: Deployment Workflow for Updates

### 8.1 Create Update Script

```bash
nano /var/www/astro-ecommerce/deploy.sh
```

Add:

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /var/www/astro-ecommerce

# Pull latest changes
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build application
echo "🔨 Building application..."
npm run build

# Restart PM2
echo "♻️  Restarting application..."
pm2 restart astro-ecommerce

# Show status
pm2 status

echo "✅ Deployment complete!"
```

Make it executable:

```bash
chmod +x deploy.sh
```

### 8.2 Deploy Updates

Whenever you push changes to your repository:

```bash
cd /var/www/astro-ecommerce
./deploy.sh
```

---

## Part 9: Monitoring and Maintenance

### 9.1 View Application Logs

```bash
# Real-time logs
pm2 logs astro-ecommerce

# Last 100 lines
pm2 logs astro-ecommerce --lines 100

# Error logs only
pm2 logs astro-ecommerce --err
```

### 9.2 Monitor Application

```bash
# Process status
pm2 status

# Detailed monitoring
pm2 monit

# Resource usage
pm2 show astro-ecommerce
```

### 9.3 Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/astro-ecommerce.access.log

# Error logs
sudo tail -f /var/log/nginx/astro-ecommerce.error.log
```

### 9.4 Restart Services

```bash
# Restart application
pm2 restart astro-ecommerce

# Restart Nginx
sudo systemctl restart nginx

# Restart all services
pm2 restart all && sudo systemctl restart nginx
```

---

## Part 10: Troubleshooting

### Issue: Application won't start

```bash
# Check PM2 logs
pm2 logs astro-ecommerce --err

# Check if port 3000 is in use
sudo lsof -i :3000

# Restart with verbose logging
pm2 delete astro-ecommerce
pm2 start ecosystem.config.js --log-date-format 'YYYY-MM-DD HH:mm:ss'
```

### Issue: 502 Bad Gateway

```bash
# Check if Node app is running
pm2 status

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Verify proxy_pass port matches your app
sudo nano /etc/nginx/sites-available/astro-ecommerce
```

### Issue: Static files not loading

```bash
# Check file permissions
sudo chown -R www-data:www-data /var/www/astro-ecommerce/dist

# Verify Nginx static file paths
ls -la /var/www/astro-ecommerce/dist/client/_astro/
```

### Issue: Out of memory

```bash
# Increase swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## Part 11: Performance Optimization

### 11.1 Enable Nginx Caching

Add to your Nginx config:

```nginx
# Add at the top of the file
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=astro_cache:10m max_size=1g inactive=60m use_temp_path=off;

# In location / block, add:
proxy_cache astro_cache;
proxy_cache_valid 200 10m;
proxy_cache_bypass $http_cache_control;
add_header X-Cache-Status $upstream_cache_status;
```

### 11.2 Optimize PM2 Instances

```bash
# Check CPU cores
nproc

# Update ecosystem.config.js instances to match cores
# e.g., if you have 2 cores, set instances: 2
```

---

## Quick Reference Commands

```bash
# Application Management
pm2 start ecosystem.config.js    # Start app
pm2 restart astro-ecommerce       # Restart app
pm2 stop astro-ecommerce          # Stop app
pm2 delete astro-ecommerce        # Remove app
pm2 logs astro-ecommerce          # View logs

# Nginx Management
sudo systemctl restart nginx      # Restart Nginx
sudo nginx -t                     # Test config
sudo systemctl status nginx       # Check status

# Deployment
cd /var/www/astro-ecommerce && ./deploy.sh

# SSL Renewal
sudo certbot renew

# System Monitoring
htop                              # System resources
df -h                             # Disk usage
free -h                           # Memory usage
```

---

## Security Checklist

- ✅ Firewall configured (UFW)
- ✅ SSL certificate installed
- ✅ Environment variables secured (.env not in git)
- ✅ Nginx security headers added
- ✅ Regular system updates scheduled
- ✅ SSH key authentication (disable password login)
- ✅ Fail2ban installed (optional but recommended)

---

## Additional Resources

- [Astro Deployment Docs](https://docs.astro.build/en/guides/deploy/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

---

**Deployment Complete! 🎉**

Your Astro e-commerce platform should now be live at:
- HTTP: `http://yourdomain.com` (redirects to HTTPS)
- HTTPS: `https://yourdomain.com`
