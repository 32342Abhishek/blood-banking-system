# Blood Banking System

A comprehensive blood donation management system with donor tracking, inventory management, and hospital integration.

## Project Overview

This project consists of:

1. **Backend**: Spring Boot application providing RESTful API services
2. **Frontend**: React-based user interface for donors, administrators, and hospital staff

## System Architecture

![Architecture](https://via.placeholder.com/800x400?text=Blood+Banking+System+Architecture)

### Key Components

- **Authentication System**: JWT-based secure access control
- **Donor Management**: Registration, history, and eligibility tracking
- **Blood Inventory**: Real-time tracking of available blood units by type
- **Hospital Integration**: Blood request handling and fulfillment
- **Appointment System**: Scheduling and management of donation appointments
- **Analytics Dashboard**: Data visualization for donation trends and inventory status

## Local Development Setup

### Prerequisites

- Java 21+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+
- Docker and Docker Compose (optional)

### Option 1: Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```
   cd BloodBackend
   ```

2. Configure the database:
   - Ensure MySQL is running
   - Create a database named `bloodbank`
   - Update `application.properties` if needed

3. Build and run the application:
   ```
   mvn clean install
   mvn spring-boot:run
   ```
   
4. The backend will be available at http://localhost:8081

#### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd bloodbankingsys/blood_banking_system-master
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. The frontend will be available at http://localhost:5173

### Option 2: Docker Compose Deployment

1. Ensure Docker and Docker Compose are installed

2. From the project root directory, run:
   ```
   docker-compose up -d
   ```
   This will build and start the following containers:
   - MySQL database
   - Spring Boot backend
   - React frontend served via Nginx

3. Access the services:
   - Frontend: http://localhost:80
   - Backend API: http://localhost:8081
   - MySQL database: localhost:3306

4. To view logs from the containers:
   ```
   docker-compose logs -f
   ```

5. To stop the containers:
   ```
   docker-compose down
   ```

### Docker Deployment Architecture

The Docker Compose setup includes:

1. **Backend Container**: Spring Boot application with optimized JRE
2. **Frontend Container**: Nginx serving the compiled React application
3. **Database Container**: MySQL 8.0 with persistent volume storage
4. **Network**: Bridge network connecting all services

#### Environment Configuration

Environment variables are stored in the `.env` file and can be customized:
- Database credentials
- JWT configuration
- API endpoints

#### Troubleshooting Docker Deployment

If you encounter issues:

1. Check container status:
   ```
   docker-compose ps
   ```

2. View specific service logs:
   ```
   docker-compose logs backend
   docker-compose logs frontend
   docker-compose logs db
   ```

3. Ensure ports 80, 8081, and 3306 are available on your host system

## Testing

### Backend Tests

Run the backend tests with:
```
cd BloodBackend
mvn test
```

### API Tests

Run the API test script:
```
# Linux/Mac
./run-api-tests.sh

# Windows PowerShell
./test-api.ps1
```

### Frontend Tests

Run the frontend tests with:
```
cd bloodbankingsys/blood_banking_system-master
npm test
```

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

- **Build**: Compiles and tests both frontend and backend
- **Test**: Runs unit and integration tests
- **Package**: Creates deployable artifacts
- **Deploy**: Deploys to staging/production environments

The workflow configuration is in `.github/workflows/ci-cd-pipeline.yml`

## Deployment

### Backend Deployment

The backend is packaged as a WAR file and can be deployed to any Java servlet container like Tomcat or run as a standalone Spring Boot application.

### Frontend Deployment

The frontend is built as static files and can be served by any web server like Nginx or deployed to a CDN.

## Documentation

### API Documentation

API documentation is available at: `/api/swagger-ui.html` when the backend is running.

### User Guide

User documentation for administrators, donors, and hospital staff is available in the `docs` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.