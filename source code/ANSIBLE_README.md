# Blood Banking System - Ansible Deployment on Linux VMs

## Prerequisites

1. **Ansible** installed on your control machine (Windows/Linux)
2. **Linux VMs** (Ubuntu/Debian or RedHat/CentOS)
3. **SSH access** to the VMs
4. **Python 3** on target VMs

## Setup Instructions

### 1. Install Ansible on Windows

```powershell
# Using pip
pip install ansible

# Or using Windows Subsystem for Linux (WSL)
wsl --install
# Then inside WSL:
sudo apt update
sudo apt install ansible -y
```

### 2. Configure Inventory

Edit `inventory.ini` and add your Linux VM details:

```ini
[webservers]
vm1 ansible_host=192.168.1.10 ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/id_rsa
vm2 ansible_host=192.168.1.11 ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/id_rsa

[database]
db1 ansible_host=192.168.1.12 ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/id_rsa

[all:vars]
ansible_python_interpreter=/usr/bin/python3
```

**Parameters:**
- `ansible_host`: IP address of your VM
- `ansible_user`: SSH username (ubuntu, centos, root, etc.)
- `ansible_ssh_private_key_file`: Path to your SSH private key

### 3. Test SSH Connectivity

```powershell
# Test connection to all hosts
ansible all -i inventory.ini -m ping

# Test connection to webservers only
ansible webservers -i inventory.ini -m ping
```

### 4. Deploy the Application

```powershell
# Navigate to source code directory
cd "c:\CloudDevops\CICD Project\source code"

# Run the deployment playbook
ansible-playbook -i inventory.ini deploy-linux-vms.yml

# Run with verbose output
ansible-playbook -i inventory.ini deploy-linux-vms.yml -v

# Run with extra verbosity
ansible-playbook -i inventory.ini deploy-linux-vms.yml -vvv
```

### 5. Deploy with Password Authentication

If using password instead of SSH key:

```powershell
ansible-playbook -i inventory.ini deploy-linux-vms.yml --ask-pass --ask-become-pass
```

## What Gets Deployed

### On Database Server:
- Docker and Docker Compose
- MySQL 8.0 container
- Database: bloodbank
- Port: 3306

### On Web Servers:
- Docker and Docker Compose
- Backend container (Spring Boot on port 8081)
- Frontend container (React on port 5173)

## Access Your Application

After deployment:

- **Frontend**: http://YOUR_VM_IP:5173
- **Backend API**: http://YOUR_VM_IP:8081
- **Database**: YOUR_DB_IP:3306

## Verify Deployment

```powershell
# Check all running containers
ansible webservers -i inventory.ini -m shell -a "docker ps"

# Check backend logs
ansible webservers -i inventory.ini -m shell -a "docker logs bloodbank_backend"

# Check frontend logs
ansible webservers -i inventory.ini -m shell -a "docker logs bloodbank_frontend"

# Check database logs
ansible database -i inventory.ini -m shell -a "docker logs bloodbank_mysql"
```

## Manage Containers

### Stop Containers
```powershell
ansible webservers -i inventory.ini -m shell -a "docker stop bloodbank_backend bloodbank_frontend"
ansible database -i inventory.ini -m shell -a "docker stop bloodbank_mysql"
```

### Start Containers
```powershell
ansible webservers -i inventory.ini -m shell -a "docker start bloodbank_backend bloodbank_frontend"
ansible database -i inventory.ini -m shell -a "docker start bloodbank_mysql"
```

### Remove Containers
```powershell
ansible webservers -i inventory.ini -m shell -a "docker rm -f bloodbank_backend bloodbank_frontend"
ansible database -i inventory.ini -m shell -a "docker rm -f bloodbank_mysql"
```

## Troubleshooting

### Check Ansible Version
```powershell
ansible --version
```

### Test SSH Connection
```powershell
ssh username@vm_ip_address
```

### Check Docker Status on VMs
```powershell
ansible all -i inventory.ini -m shell -a "systemctl status docker"
```

### View Docker Networks
```powershell
ansible all -i inventory.ini -m shell -a "docker network ls"
```

### Check Firewall Rules
```powershell
ansible webservers -i inventory.ini -m shell -a "sudo ufw status"
```

### Open Required Ports (if firewall is active)
```powershell
ansible webservers -i inventory.ini -m shell -a "sudo ufw allow 5173/tcp"
ansible webservers -i inventory.ini -m shell -a "sudo ufw allow 8081/tcp"
ansible database -i inventory.ini -m shell -a "sudo ufw allow 3306/tcp"
```

## Update Deployment

### Update Backend
```powershell
ansible webservers -i inventory.ini -m shell -a "docker pull abhi9142/bloodbank-backend:v2"
ansible webservers -i inventory.ini -m shell -a "docker restart bloodbank_backend"
```

### Update Frontend
```powershell
ansible webservers -i inventory.ini -m shell -a "docker pull abhi9142/bloodbank-frontend:v2"
ansible webservers -i inventory.ini -m shell -a "docker restart bloodbank_frontend"
```

## Configuration Variables

Edit `deploy-linux-vms.yml` to customize:

```yaml
vars:
  project_name: blood-banking-system
  mysql_root_password: Abhi@9142
  mysql_database: bloodbank
  backend_image: abhi9142/bloodbank-backend:v2
  frontend_image: abhi9142/bloodbank-frontend:v2
  docker_network: bloodbank-network
```

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Web Server 1  │     │   Web Server 2  │
│                 │     │                 │
│  Frontend:5173  │     │  Frontend:5173  │
│  Backend:8081   │     │  Backend:8081   │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  Database Server │
            │                  │
            │    MySQL:3306    │
            └──────────────────┘
```

## Notes

- All containers use the `bloodbank-network` Docker network
- MySQL data is persisted using Docker volumes
- Containers are set to restart automatically
- Healthchecks are configured for MySQL
