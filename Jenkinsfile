pipeline{
    agent any
    environment {
        caCertificate_kube = "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURJVENDQWdtZ0F3SUJBZ0lCQWpBTkJna3Foa2lHOXcwQkFRc0ZBREFWTVJNd0VRWURWUVFERXdwdGFXNXAKYTNWaVpVTkJNQjRYRFRJMk1EVXhOVEUwTVRrME9Wb1hEVEk1TURVeE5URTBNVGswT1Zvd01URVhNQlVHQTFVRQpDaE1PYzNsemRHVnRPbTFoYzNSbGNuTXhGakFVQmdOVkJBTVREVzFwYm1scmRXSmxMWFZ6WlhJd2dnRWlNQTBHCkNTcUdTSWIzRFFFQkFRVUFBNElCRHdBd2dnRUtBb0lCQVFETDArbkpERGNMUW9yeTQ5eGw5MXpSUFN3SW9hbTgKZi9lNVZwbmhZVUM0ZTYva3lOZmkwYWIrRElGYXpySytOb1BIWTRVaWFJMCs5d3VRUDBGZEtVYUxDYnFKLzJndQp6dEVOOUlHbmtndjFQdEhSV2g4MlB4aHVRTUNKVVlzb2FxeXR3Z21YUDQ0NUY4RUh2ZG5JM1hVMDZWYzNlYVo4CjlEWitTdnFlaFExYXNGYkt6NittL3l2ZHRuYWFOWUJuaFhrM3k1ciswNXFDelZTL0VWcEt2S3Y1VDh5UWplZWUKSW9qQW1RWk5WNC9POEl4UCs5RnV0T1hZT0JSMHFpalVHcDZobi8zRHNCY1AvZWFJMkdCTzZ1VnhjdVJlU1JmUwpqaXYxaWVCY3ZyQk00ODFQYjBkYm5zRGp2a1NWOU1GNUZrR29qMmNKYXRpRXcxNll2bkZDa3JQWkFnTUJBQUdqCllEQmVNQTRHQTFVZER3RUIvd1FFQXdJRm9EQWRCZ05WSFNVRUZqQVVCZ2dyQmdFRkJRY0RBUVlJS3dZQkJRVUgKQXdJd0RBWURWUjBUQVFIL0JBSXdBREFmQmdOVkhTTUVHREFXZ0JUOVZiODNTS1FlT3hDK0pMbXdxK2hkZkNtZgprekFOQmdrcWhraUc5dzBCQVFzRkFBT0NBUUVBYWdtWnRtRFA1S0JXcXhGVkVGdVVxUHdoaFlsYlBjYTF3dE5iCkhzUlUyby9ES05kTVAzUlVNVk9KRmxnejZoREU0UjhKbmVCbDc3aFRIRS9VdnM4UjBiaTRQTno3WksrOFc0NlEKYklGWTEyeElzT0MxUkViTFRTQW9vdmFaLzdFbUJQSkFFa3hLelpTeTFKM3NIbWo1RDZlWnlUK1BXWkN5eVhuWQpRZHRpOFUxVWlHRTNVYzBTMWEyY2dDQUUvS3pKeGJqL3czc0Y3cXBhMkdEU2wvSjhxUXlWajhLb0JJaUkwY2lOCkNsVGo2Ykhqc2lkYThLL01DTUJGcDBJaHh2aDNMUXo4RDlGUU1EZFhrQVppd2U0eVdQVjdOSEpuVTJNbjkxTDMKaEtKNWl3WHBWdnp3SW9qUnpvdDBZYXdWS0J2dEJTbTVlbmFxaEJUMU1YZ0FwZXBPb3c9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg=="
    }
    parameters {
        string(name: 'ENV', defaultValue: 'default', description: 'Environment to deploy to')
        string(name: 'VERSION', defaultValue: "1.${BUILD_NUMBER}.0", description: 'Version of the application')
        string(name: 'app_name', defaultValue: 'myapp', description: 'Name of the application')
        string(name: 'awsurl', defaultValue: 'localstack-localstack-1:4566', description: 'AWS CLI download URL')
        string(name: 'awsregion', defaultValue: 'us-east-1', description: 'AWS Region')
        string(name: 'awsuser', defaultValue: 'AWS', description: 'AWS Access Key ID')
        string(name: 'reponame', defaultValue: 'myapp-repo', description: 'ECR Repository Name')
        string(name: 'dockerTag', defaultValue: '000000000000.dkr.ecr.us-east-1.localhost.localstack.cloud:4566/myapp-repo', description: 'Docker tag')
        string(name: 'K8S_SERVER_URL', defaultValue: 'http://minikube:8443', description: 'Kubernetes API Server URL')
        string(name: 'DB_HOST', defaultValue: 'localhost.localstack.cloud:4566', description: 'Database Host')
        string(name: 'DB_DATABASE', defaultValue: 'mydb', description: 'Database Name')
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
            environment {
                app_name = "${params.app_name}"
                VERSION = "${params.VERSION}"
                dockerTag = "${params.dockerTag}"
            }
            steps {
                sh 'eval $(minikube docker-env -u)'
                // sh "export DB_HOST=${DB_HOST}"
                // sh "export DB_USER=${DB_USER}"
                // sh "export DB_PWD=${DB_PWD}"
                // sh "export DB_DATABASE=${DB_DATABASE}"
                sh 'docker build . -t $app_name:$VERSION'   
                sh 'docker tag $app_name:$VERSION $dockerTag:$VERSION'
            }   
        }
        stage('Deploy to ECR') {
            environment {
                awsuser = "${params.awsuser}"
                dockerTag = "${params.dockerTag}"
                VERSION = "${params.VERSION}"
            }
            steps {
                withAWS(endpointUrl: "http://${awsurl}", region: "${awsregion}", credentials: 'aws-cred') {
                sh 'aws ecr get-login-password | docker login --username $awsuser --password-stdin $dockerTag'
                sh 'docker push $dockerTag:$VERSION'
            }
            }
        }
        stage('Deploy to Kubernetes') {
            environment {
                app_name = "${params.app_name}"
                VERSION = "${params.VERSION}"
                dockerTag = "${params.dockerTag}"
                K8S_SERVER_URL = "${params.K8S_SERVER_URL}"
                DB_HOST = "${params.DB_HOST}"
                DB_DATABASE = "${params.DB_DATABASE}"
                ENV = "${params.ENV}"
            }
            steps {
                kubeconfig(credentialsId: 'k8s_config', serverUrl: "${K8S_SERVER_URL}", caCertificate: "${caCertificate_kube}") {
                    withCredentials([usernamePassword(credentialsId: 'db_cred', usernameVariable: 'DB_USER', passwordVariable: 'DB_PWD')]) {
                        sh 'helm upgrade --install $app_name ./helm/$app_name --set image.pullPolicy=Always,image.repository=$dockerTag,image.tag=$VERSION,env.DB_HOST=$DB_HOST,env.DB_USER=$DB_USER,env.DB_PWD=$DB_PWD,env.DB_DATABASE=$DB_DATABASE --namespace $ENV --create-namespace'
                    }
                }
            }
        }
    }
}
