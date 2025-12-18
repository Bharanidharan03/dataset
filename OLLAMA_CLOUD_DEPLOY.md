# Cloud Ollama Deployment Guide

To make your Medical Analyzer work globally without users needing to run Ollama locally, follow these steps to deploy to a Cloud GPU server (like AWS G4dn, Lambda Labs, or RunPod).

## 1. Get a GPU Server
*   **Recommended**: Ubuntu 22.04 LTS
*   **GPU**: NVIDIA T4, L4, or A10G (minimum 8GB VRAM)

## 2. Run the Deployment Script
Copy the `deploy-ollama.sh` file to your server and run it:
```bash
chmod +x deploy-ollama.sh
./deploy-ollama.sh
```

## 3. Network & Firewall (CRITICAL)
Your cloud provider usually blocks all incoming traffic by default. You **MUST** open the following port in your Security Group/Firewall settings:
*   **Protocol**: TCP
*   **Port**: 11434
*   **Source**: Any (0.0.0.0/0)

## 4. Connect the Web App
1.  Go to your Live App: [https://dataset-7ba96.web.app](https://dataset-7ba96.web.app)
2.  Open **Settings** (Gear Icon).
3.  Change **Ollama URL** to `http://YOUR_SERVER_IP:11434`.
4.  Click **Save**.

---

### 🛡️ Security Note
This setup makes your Ollama instance public. If you want to password-protect it, you can install Nginx on the same server and set up Basic Auth. 

Example Nginx config snippet:
```nginx
location / {
    proxy_pass http://localhost:11434;
    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```
