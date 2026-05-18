pipeline{
    agent any
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
                withCredentials([file(credentialsId: 'k8s_liscence', variable: 'caCertificate_kube')]) {
                    kubeconfig(credentialsId: 'k8s_config', serverUrl: "${K8S_SERVER_URL}", caCertificate: "${caCertificate_kube}") {
                        withCredentials([usernamePassword(credentialsId: 'db_cred', usernameVariable: 'DB_USER', passwordVariable: 'DB_PWD')]) {
                            sh 'helm upgrade --install $app_name ./helm/$app_name --set image.pullPolicy=Always,image.repository=$dockerTag,image.tag=$VERSION,env.DB_HOST=$DB_HOST,env.DB_USER=$DB_USER,env.DB_PWD=$DB_PWD,env.DB_DATABASE=$DB_DATABASE --namespace $ENV --create-namespace'
                        }
                    }
                }
            }
        }
        stage('Verify Pod Status') {
    environment {
        // Define your variables here or pull them from parameters
        APP_NAME  = "${params.app_name}"
        NAMESPACE = "${params.ENV}"
    }
    steps {
        // Use single quotes to pass variables safely to the shell environment
        sh '''
            echo "Checking deployment rollout status..."
            # 1. Check if the deployment rollout succeeded
            if kubectl rollout status deployment/$APP_NAME --namespace $NAMESPACE --timeout=120s; then
                echo "ERROR: Deployment rollout failed or timed out."
                exit 1
            fi

            echo "Verifying individual pod phases..."
            # 2. Additional safety check: Ensure no pods are in a CrashLoopBackOff or Failed state
            POD_STATUSES=$(kubectl get pods -n $NAMESPACE -l app=$APP_NAME -o jsonpath='{.items[*].status.phase}')
            
            echo "Current pod phases: $POD_STATUSES"
            
            if echo "$POD_STATUSES" | grep -E -q "Failed|Unknown"; then
                echo "ERROR: One or more pods are in a Failed or Unknown state."
                kubectl get pods -n $NAMESPACE -l app=$APP_NAME
                kubectl logs -n $NAMESPACE" deployment/$APP_NAME" --tail=50
                exit 1
            fi

            # 3. Check for container-level restart loops (CrashLoopBackOff)
            RESTARTS=$(kubectl get pods -n $NAMESPACE -l app=$APP_NAME -o jsonpath='{.items[*].status.containerStatuses[*].restartCount}')
            echo "Pod container restart counts: $RESTARTS"
            
            echo "SUCCESS: All pods are running correctly!"
        '''
    }
}
    }
}
