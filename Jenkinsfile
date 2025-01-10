pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo "소스 코드 가져오는 중..."
                git branch: 'dev', url: 'https://github.com/n90425/EzPOS'
            }
        }

        stage('Build Backend') {
            steps {
                echo "Spring Boot 백엔드 빌드 중..."
                sh '''
                cd backend
                chmod +x mvnw
                ./mvnw clean package -Dmaven.repo.local=/var/jenkins_home/.m2/repository -DskipTests -e -B
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

        stage('Package Docker Images') {
            steps {
                echo "Docker 이미지 생성 중..."
                sh '''
                cd frontend
                mkdir -p ../backend/src/main/resources/static
                cp -r build ../backend/src/main/resources/static

                cd ..
                docker build -t ezpos-backend -f backend/Dockerfile .
                docker build -t ezpos-frontend -f frontend/Dockerfile .
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo "애플리케이션 배포 중..."
                sh '''
                docker-compose down
                docker-compose up -d --remove-orphans
                '''
            }
        }
    }

    post {
        success {
            echo "배포가 성공적으로 완료되었습니다!"
        }
        failure {
            echo "배포 중 문제가 발생했습니다."
        }
    }
}
