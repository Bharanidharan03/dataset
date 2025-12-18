#!/bin/bash

# Deployment Script for Ollama on a Cloud GPU Server (Ubuntu/Debian)
# Run this on your remote server to prepare it for your Medical Analyzer app.

echo "🚀 Starting Ollama Cloud Deployment..."

# 1. Update and Install Dependencies
sudo apt-get update
sudo apt-get install -y curl ca-certificates nmap

# 2. Install Ollama
echo "📦 Installing Ollama..."
curl -fsSL https://ollama.com/install.sh | sh

# 3. Configure Ollama for External Access
echo "⚙️ Configuring Ollama environment variables..."
# We need to set OLLAMA_HOST to 0.0.0.0 and OLLAMA_ORIGINS to * for cross-origin requests
sudo mkdir -p /etc/systemd/system/ollama.service.d
cat <<EOF | sudo tee /etc/systemd/system/ollama.service.d/override.conf
[Service]
Environment="OLLAMA_HOST=0.0.0.0"
Environment="OLLAMA_ORIGINS=*"
EOF

# 4. Reload Systemd and Restart Ollama
echo "🔄 Restarting Ollama service..."
sudo systemctl daemon-reload
sudo systemctl restart ollama

# 5. Pre-pull the recommended model
echo "📥 Pre-pulling Llama3 model (this may take a few minutes)..."
ollama pull llama3

echo "✅ Ollama is now running on port 11434!"
echo "📍 Your Server IP: $(curl -s ifconfig.me)"
echo "⚠️ IMPORTANT: Ensure port 11434 is OPEN in your cloud provider's firewall (AWS/GCP/Azure)."
