# Blood Banking System - Ansible Deployment Summary

## ✅ Deployment Completed Successfully!

### Deployment Method
**Ansible Playbook** on Ubuntu WSL with Docker

### Deployment Date
November 28, 2024

---

## 📦 Deployed Components

### 1. MySQL Database
- **Container Name:** bloodbank_mysql
- **Image:** mysql:8.0
- **Port:** 3307 (host) → 3306 (container)
- **Database:** bloodbank
- **Volume:** bloodbank_mysql_data
- **Status:** ✅ Running

### 2. Backend Application
- **Container Name:** bloodbank_backend
- **Image:** abhi9142/bloodbank-backend:v2
- **Port:** 8082 (host) → 8081 (container)
- **Technology:** Spring Boot 3.2.5, Java 21, Tomcat 10.1
- **Status:** ✅ Running

### 3. Frontend Application
- **Container Name:** bloodbank_frontend
- **Image:** abhi9142/bloodbank-frontend:v2
- **Port:** 5174 (host) → 5173 (container)
- **Technology:** React, Vite, Nginx Alpine
- **Status:** ✅ Running

---

## 🌐 Access URLs

| Component | URL | Description |
|-----------|-----|-------------|
| **Frontend** | http://localhost:5174 | React application UI |
| **Backend API** | http://localhost:8082 | Spring Boot REST API |
| **MySQL** | localhost:3307 | Database server |

---

## 🔧 Technical Details

### Docker Network
- **Network Name:** bloodbank-network
- **Type:** Bridge network
- **Purpose:** Connects MySQL, Backend, and Frontend containers

### Environment Variables
```yaml
MySQL:
  - MYSQL_ROOT_PASSWORD: Abhi@9142
  - MYSQL_DATABASE: bloodbank

Backend:
  - SPRING_DATASOURCE_URL: jdbc:mysql://bloodbank_mysql:3306/bloodbank
  - SPRING_DATASOURCE_USERNAME: root
  - SPRING_DATASOURCE_PASSWORD: Abhi@9142
```

### Ansible Configuration
- **Ansible Version:** 10.7.0 (ansible-core 2.17.14)
- **Python Version:** 3.10
- **Collection Used:** community.docker 5.0.2
- **Inventory:** localhost-simple-inventory.ini
- **Playbook:** deploy-localhost-simple.yml

---

## 📝 Deployment Process

### 1. Prerequisites Installed
```bash
# Ansible and dependencies
sudo apt update
sudo apt install -y ansible python3-pip
pip3 install docker docker-compose

# Ansible Galaxy collection
ansible-galaxy collection install community.docker
```

### 2. Playbook Execution
```bash
cd /mnt/c/CloudDevops/CICD\ Project/source\ code
/home/abhishek/.local/bin/ansible-playbook -i localhost-simple-inventory.ini deploy-localhost-simple.yml
```

### 3. Tasks Executed (16 tasks)
1. ✅ Gathered system facts
2. ✅ Stopped existing MySQL container
3. ✅ Stopped existing backend container
4. ✅ Stopped existing frontend container
5. ✅ Removed existing Docker network
6. ✅ Created bloodbank-network
7. ✅ Pulled MySQL 8.0 image
8. ✅ Pulled backend v2 image
9. ✅ Pulled frontend v2 image
10. ✅ Deployed MySQL container
11. ✅ Waited for MySQL to be ready (port 3307)
12. ✅ Deployed backend container
13. ✅ Waited for backend to be ready (port 8082)
14. ✅ Deployed frontend container
15. ✅ Waited for frontend to be ready (port 5174)
16. ✅ Displayed deployment status

---

## 🎯 Key Features

### Infrastructure as Code
- ✅ **Automated Deployment:** Complete automation using Ansible
- ✅ **Idempotent:** Can run multiple times safely
- ✅ **Repeatable:** Consistent deployment across environments
- ✅ **Version Controlled:** All playbooks stored in GitHub

### Container Management
- ✅ **Auto-restart:** All containers configured with restart policy 'always'
- ✅ **Network Isolation:** Dedicated Docker network for application
- ✅ **Health Checks:** Playbook waits for services to be ready
- ✅ **Port Mapping:** Clean separation of host and container ports

### Deployment Strategy
- ✅ **Zero-downtime:** Existing containers stopped before new deployment
- ✅ **Image Caching:** Docker images pulled only if not present
- ✅ **Volume Persistence:** MySQL data persists across container restarts

---

## 📊 Deployment Timeline

| Step | Duration | Status |
|------|----------|--------|
| Prerequisites Installation | ~2 minutes | ✅ Complete |
| Ansible Setup | ~1 minute | ✅ Complete |
| Playbook Execution | ~1 minute | ✅ Complete |
| **Total Time** | **~4 minutes** | ✅ Success |

---

## 🔄 Comparison: Deployment Methods

| Method | Status | Access URLs |
|--------|--------|-------------|
| **Kubernetes** | ✅ Running | Frontend: http://localhost:30173<br>Backend: http://localhost:30081 |
| **Ansible (New)** | ✅ Running | Frontend: http://localhost:5174<br>Backend: http://localhost:8082 |

Both deployments are currently active and running independently!

---

## 📁 Files Created

### Ansible Playbooks
```
source code/
├── deploy-linux-vms.yml           # Linux VMs deployment
├── deploy-localhost.yml           # Original localhost deployment
├── deploy-localhost-simple.yml    # Simplified localhost deployment ⭐
├── inventory.ini                  # Linux VMs inventory
├── localhost-inventory.ini        # Localhost inventory
└── localhost-simple-inventory.ini # Simplified localhost inventory ⭐
```

### Documentation
```
source code/
├── ANSIBLE_README.md              # Comprehensive Ansible guide
└── ANSIBLE_DEPLOYMENT_SUMMARY.md  # This file ⭐
```

---

## ✅ Verification Commands

### Check Running Containers
```bash
docker ps --filter "name=bloodbank_"
```

### View Container Logs
```bash
# MySQL logs
docker logs bloodbank_mysql

# Backend logs
docker logs bloodbank_backend

# Frontend logs
docker logs bloodbank_frontend
```

### Test Application
```bash
# Frontend
curl http://localhost:5174

# Backend health
curl http://localhost:8082

# MySQL connection
mysql -h 127.0.0.1 -P 3307 -u root -p
```

---

## 🎓 Lessons Learned

### Port Conflicts
- **Issue:** Kubernetes deployment already using ports 3306, 8081, 5173
- **Solution:** Used different ports (3307, 8082, 5174) for Ansible deployment
- **Learning:** Always check for port availability before deployment

### Ansible Version Compatibility
- **Issue:** Ubuntu default Ansible 2.10.8 incompatible with community.docker
- **Solution:** Upgraded to Ansible 10.7.0 via pip3
- **Learning:** Use latest Ansible for modern collections

### WSL Docker Integration
- **Success:** Seamless integration between Windows and WSL Docker
- **Learning:** Access playbooks via /mnt/c path from WSL

---

## 🚀 Next Steps

### Optional Enhancements
1. **Add SSL/TLS** - Configure HTTPS for frontend and backend
2. **Monitoring** - Integrate Prometheus and Grafana
3. **CI/CD Pipeline** - Automate deployment on code push
4. **Backup Strategy** - Schedule MySQL backups
5. **Load Balancing** - Add Nginx reverse proxy

### Cleanup (if needed)
```bash
# Stop all containers
docker stop bloodbank_mysql bloodbank_backend bloodbank_frontend

# Remove containers
docker rm bloodbank_mysql bloodbank_backend bloodbank_frontend

# Remove network
docker network rm bloodbank-network

# Remove volume (WARNING: deletes database data)
docker volume rm bloodbank_mysql_data
```

---

## 📞 Support Information

### Docker Hub Images
- **Backend:** https://hub.docker.com/r/abhi9142/bloodbank-backend
- **Frontend:** https://hub.docker.com/r/abhi9142/bloodbank-frontend

### GitHub Repository
- **URL:** https://github.com/32342Abhishek/blood-banking-system
- **Branch:** main
- **Ansible Files:** source code/ directory

---

## 🏆 Achievement Summary

✅ **Successfully deployed Blood Banking System using Ansible**
✅ **All 3 containers running and healthy**
✅ **Frontend accessible at http://localhost:5174**
✅ **Backend accessible at http://localhost:8082**
✅ **Database running on port 3307**
✅ **Infrastructure as Code implemented**
✅ **Files committed and pushed to GitHub**
✅ **Complete documentation provided**

---

**Deployment Status:** ✅ **SUCCESSFUL**  
**Deployment Time:** November 28, 2024  
**Deployment Method:** Ansible Playbook  
**Environment:** Ubuntu WSL with Docker  

---

*End of Deployment Summary*
