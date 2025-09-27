FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies first for better caching
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk
WORKDIR /app
# Copy compiled war from build stage
COPY --from=build /app/target/*.war /app/app.war
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.war"]