# Stage 1: Build Stage
FROM openjdk:17-alpine AS build

# 작업 디렉토리 생성
WORKDIR /app

# Maven Wrapper 및 pom.xml 복사
COPY backend/mvnw .
COPY backend/.mvn .mvn
COPY backend/pom.xml .

# Maven Wrapper 실행 권한 부여
RUN chmod +x ./mvnw

# 의존성만 먼저 복사하고 설치 (캐싱 활용)
RUN ./mvnw dependency:go-offline -B

# 소스 코드 복사 및 빌드
COPY backend/src ./src
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime Stage
FROM openjdk:17-alpine

# JAR 파일 위치 및 복사
ARG JAR_FILE=POS-System-0.0.1-SNAPSHOT.jar
COPY --from=build /app/target/${JAR_FILE} app.jar

# 포트 설정
EXPOSE 8080

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "/app.jar"]
