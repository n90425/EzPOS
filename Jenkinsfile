pipeline {
    agent any

    parameters {
        string(name: 'REACT_APP_API_BASE_URL', defaultValue: 'http://3.34.46.145/api', description: 'API base URL for the React frontend')
    }
    environment {
        DB_CREDENTIALS = credentials('SPRING_DATASOURCE_USERNAME_PASSWORD')
    }


    stages {
        stage('Checkout') {
            steps {
                echo "소스 코드 가져오는 중..."
                git branch: 'main', url: 'https://github.com/rlaeksl0124/EzPOS'
            }
        }

        stage('Prepare Secret File') {
            steps {
                echo "Secret 파일 준비 중..."
                withCredentials([file(credentialsId: 'application-properties-secret', variable: 'APP_PROPERTIES')]) {
                    sh '''
                    cp $APP_PROPERTIES backend/src/main/resources/application.properties
                    '''
                }
            }
        }

        stage('Build Backend') {
            steps {
                echo "Spring Boot 백엔드 빌드 중..."
                sh '''
                cd backend
                chmod +x mvnw
                ./mvnw clean package \
                    -Dmaven.repo.local=/var/jenkins_home/.m2/repository \
                    -DskipTests -e -B
                if [ ! -f target/*.jar ]; then
                    echo "JAR 파일이 생성되지 않았습니다."
                    exit 1
                fi
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                echo "React 프론트엔드 빌드 중..."
                sh '''
                cd frontend
                echo "REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}" > .env
                npm ci --silent
                CI=false npm run build --silent
                '''
            }
        }

        stage('Package Docker Images') {
            steps {
                echo "Docker 이미지 생성 중..."
                sh '''
                cp backend/target/*.jar backend/app.jar
                cp -r frontend/build backend/src/main/resources/static

                docker-compose build
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo "애플리케이션 배포 중..."
                sh '''
                cd /var/jenkins_home/workspace/ezpos
                docker-compose down
                docker-compose up -d --remove-orphans
                '''
            }
        }
    }

    post {
        always {
            cleanWs() // 워크스페이스 정리
        }
        success {
            echo "배포가 성공적으로 완료되었습니다!"
        }
        failure {
            echo "배포 중 문제가 발생했습니다."
        }
    }
}