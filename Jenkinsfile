pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo "소스 코드 가져오는 중..."
                git branch: 'main', url: 'https://github.com/n90425/EzPOS'
            }
        }

        stage('Build Backend') {
            steps {
                echo "Spring Boot 백엔드 빌드 중..."
                sh '''
                cd backend
                ./mvnw clean package -DskipTests
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                echo "React 프론트엔드 빌드 중..."
                sh '''
                cd frontend
                npm install
                CI=false npm run build
                '''
            }
        }
    }
}
