## BUILD STAGES ##
FROM maven:3.9-eclipse-temurin-17-alpine as build

WORKDIR /app
COPY . .
RUN mvn install -DskipTests=true
## RUN STAGE ##
FROM amazoncorretto:17-alpine
WORKDIR /run
COPY --from=build /app/target/edu-platform-server-0.0.1-SNAPSHOT.jar /run/edu-platform-server.jar
EXPOSE 8080
ENTRYPOINT java -jar /run/edu-platform-server.jar --spring.profiles.active=prod