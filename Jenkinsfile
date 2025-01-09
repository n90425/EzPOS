pipeline {
    agent { label 'agent-server' } // Agent 서버 지정 (Jenkins 노드 설정에 따라 변경)

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

        stage('Package Docker Images') {
            steps {
                echo "Docker 이미지 생성 중..."
                sh '''
                docker-compose build
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo "애플리케이션 배포 중..."
                sh '''
                docker-compose down
                docker-compose up -d
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

        stage('Deploy') {
                    steps {
                        echo "Docker Compose로 애플리케이션 배포 중..."
                        sh '''
                        docker-compose down
                        docker-compose up -d
                        '''
                    }
                }
    }
}
