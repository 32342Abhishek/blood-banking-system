# Stage 1: Build with Maven and Java 21
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Run with Tomcat
FROM tomcat:10.1-jdk21

# Remove default apps
RUN rm -rf /usr/local/tomcat/webapps/*

# Copy backend WAR to Tomcat
COPY --from=build /app/target/*.war /usr/local/tomcat/webapps/bloodbank.war

EXPOSE 8081

# Set environment variables
ENV SERVER_PORT=8081

CMD ["catalina.sh", "run"]
