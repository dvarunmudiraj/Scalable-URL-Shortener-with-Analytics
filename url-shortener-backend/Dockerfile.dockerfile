# Dockerfile
FROM openjdk:17
VOLUME /tmp
COPY target/url-shortener.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
