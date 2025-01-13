FROM bellsoft/liberica-openjdk-alpine:17
# or
# FROM openjdk:8-jdk-alpine
# FROM openjdk:11-jdk-alpine

#CMD ["./gradlew", "clean", "build"]
# or Maven
CMD ["./mvnw", "clean", "package"]

VOLUME /tmp

ARG JAR_FILE=app.jar
COPY ${JAR_FILE} app.jar

EXPOSE 80

ENTRYPOINT ["java","-jar","/app.jar"]