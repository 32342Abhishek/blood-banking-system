#!/bin/bash

# Blood Banking System - Ubuntu Deployment Script
# This script deploys the application using Docker on Ubuntu

set -e

# Configuration
PROJECT_NAME="blood-banking-system"
MYSQL_ROOT_PASSWORD="Abhi@9142"
MYSQL_DATABASE="bloodbank"
BACKEND_IMAGE="abhi9142/bloodbank-backend:v2"
FRONTEND_IMAGE="abhi9142/bloodbank-frontend:v2"
DOCKER_NETWORK="bloodbank-network"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Blood Banking System - Ubuntu Deployment${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if Docker is installed
echo -e "\n${YELLOW}Checking Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Installing Docker...${NC}"
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg lsb-release
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io
else
    echo -e "${GREEN}✓ Docker is installed: $(docker --version)${NC}"
fi

# Start Docker service
echo -e "\n${YELLOW}Starting Docker service...${NC}"
sudo service docker start 2>/dev/null || true
echo -e "${GREEN}✓ Docker service started${NC}"

# Create Docker network
echo -e "\n${YELLOW}Creating Docker network...${NC}"
sudo docker network create ${DOCKER_NETWORK} 2>/dev/null || echo -e "${GREEN}✓ Network already exists${NC}"

# Stop and remove existing containers
echo -e "\n${YELLOW}Cleaning up existing containers...${NC}"
sudo docker stop bloodbank_mysql bloodbank_backend bloodbank_frontend 2>/dev/null || true
sudo docker rm bloodbank_mysql bloodbank_backend bloodbank_frontend 2>/dev/null || true
echo -e "${GREEN}✓ Cleanup completed${NC}"

# Deploy MySQL
echo -e "\n${YELLOW}Deploying MySQL Database...${NC}"
sudo docker run -d \
  --name bloodbank_mysql \
  --network ${DOCKER_NETWORK} \
  -e MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} \
  -e MYSQL_DATABASE=${MYSQL_DATABASE} \
  -p 3306:3306 \
  -v mysql_data:/var/lib/mysql \
  --restart always \
  mysql:8.0

echo -e "${GREEN}✓ MySQL container started${NC}"
echo -e "${YELLOW}Waiting for MySQL to be ready...${NC}"
sleep 15

# Deploy Backend
echo -e "\n${YELLOW}Deploying Backend Application...${NC}"
sudo docker run -d \
  --name bloodbank_backend \
  --network ${DOCKER_NETWORK} \
  -e SPRING_DATASOURCE_URL="jdbc:mysql://bloodbank_mysql:3306/${MYSQL_DATABASE}?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC" \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=${MYSQL_ROOT_PASSWORD} \
  -e SPRING_JPA_HIBERNATE_DDL_AUTO=update \
  -e SERVER_PORT=8081 \
  -p 8081:8081 \
  --restart always \
  ${BACKEND_IMAGE}

echo -e "${GREEN}✓ Backend container started${NC}"
echo -e "${YELLOW}Waiting for Backend to initialize...${NC}"
sleep 20

# Deploy Frontend
echo -e "\n${YELLOW}Deploying Frontend Application...${NC}"
sudo docker run -d \
  --name bloodbank_frontend \
  --network ${DOCKER_NETWORK} \
  -e VITE_API_URL=http://localhost:8081 \
  -p 5173:5173 \
  --restart always \
  ${FRONTEND_IMAGE}

echo -e "${GREEN}✓ Frontend container started${NC}"

# Display status
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "\n${YELLOW}Container Status:${NC}"
sudo docker ps --filter "name=bloodbank" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Access Your Application:${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Frontend: ${YELLOW}http://localhost:5173${NC}"
echo -e "Backend:  ${YELLOW}http://localhost:8081${NC}"
echo -e "Database: ${YELLOW}localhost:3306${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "\n${YELLOW}Useful Commands:${NC}"
echo -e "View logs:    ${GREEN}sudo docker logs bloodbank_backend${NC}"
echo -e "Stop all:     ${GREEN}sudo docker stop bloodbank_mysql bloodbank_backend bloodbank_frontend${NC}"
echo -e "Start all:    ${GREEN}sudo docker start bloodbank_mysql bloodbank_backend bloodbank_frontend${NC}"
echo -e "Remove all:   ${GREEN}sudo docker rm -f bloodbank_mysql bloodbank_backend bloodbank_frontend${NC}"
echo -e "${GREEN}========================================${NC}"
