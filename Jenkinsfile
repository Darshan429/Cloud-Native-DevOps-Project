pipeline {
    agent any

    environment {
        KUBECONFIG = '/tmp/config'
        DOCKER_IMAGE = 'darshan99015/expense-app'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    docker build -t $DOCKER_IMAGE:${BUILD_NUMBER} .
                '''
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USER" --password-stdin

                        docker push $DOCKER_IMAGE:${BUILD_NUMBER}

                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    echo "Checking Kubernetes connection..."
                    kubectl get nodes

                    echo "Deploying application..."
                    helm upgrade --install backend helm \
                        -n expense \
                        --set deployment.imageVersion=${BUILD_NUMBER}

                    echo "Waiting for deployment..."
                    kubectl rollout status deployment/backend -n expense --timeout=120s
                '''
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully'
        }

        failure {
            echo 'CI/CD pipeline failed'
        }
    }
}