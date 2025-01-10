# Node.js를 기반으로 하는 리액트 앱 이미지
FROM node:18-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# frontend의 package.json 복사
COPY frontend/package.json .
# 의존성 설치
RUN npm install
# frontend 폴더의 모든 파일 복사
COPY frontend/ .
# 리액트 앱 빌드
RUN npm run build

# Nginx를 기반으로 하는 최종 이미지
FROM nginx:alpine

# Nginx 설정 파일 복사
COPY frontend/nginx/nginx.conf /etc/nginx/nginx.conf

# 빌드된 리액트 앱을 Nginx의 HTML 디렉토리로 복사
COPY --from=build /app/build /usr/share/nginx/html

# 포트 설정
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
