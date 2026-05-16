pipeline{
    agent any
    parameters {
        string(name: 'ENV', defaultValue: 'dev', description: 'Environment to deploy to')
        string(name: 'VERSION', defaultValue: "1.${BUILD_NUMBER}.0", description: 'Version of the application')
        string(name: 'app_name', defaultValue: 'myapp', description: 'Name of the application')
        string(name: 'awsurl', defaultValue: 'http://localstack-localstack-1:4566', description: 'AWS CLI download URL')
        string(name: 'awsregion', defaultValue: 'eu-north-1', description: 'AWS Region')
        string(name: 'awsuser', defaultValue: 'AWS', description: 'AWS Access Key ID')
        string(name: 'dockerTag', defaultValue: '000000000000.dkr.ecr.eu-north-1.localhost.localstack.cloud:4566/myapp-repo', description: 'Docker tag')
        string(name: 'K8S_SERVER_URL', defaultValue: 'http://minikube:8443', description: 'Kubernetes API Server URL')
    }
    tools {
        nodejs 'nodejs'
        dockerTool 'docker'
    }
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }
        stage('Build') {
            steps {
                sh 'eval $(minikube docker-env -u)'
                sh "docker build . -t ${app_name}:${VERSION}"   
                sh "docker tag ${app_name}:${VERSION} ${dockerTag}:${VERSION}"    
            }   
        }
        stage('Deploy to ECR') {
            steps {
                withAWS(endpointUrl: "${awsurl}", region: "${awsregion}", credentials: 'aws-cred') {
                sh "aws ecr get-login-password | docker login --username ${awsuser} --password-stdin ${dockerTag}"
                sh "docker push ${dockerTag}:${VERSION}"
            }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                kubeconfig(credentialsId: 'k8s_config') {
                    sh "helm upgrade --install ${app_name} ./${app_name} --set image.repository=${dockerTag},image.tag=${VERSION} --namespace ${ENV} --create-namespace"
                }
            }
        }
    }
}