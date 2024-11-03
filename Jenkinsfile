pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                script {
                    sh 'npm install'
                }
            }
        }

        stage('Run Playwright Tests') {
            steps {
                script {
                    sh 'npx playwright test'
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                script {
                    // Tạo báo cáo Allure
                    sh 'allure generate ./allure-results --clean -o ./allure-report'
                }
            }
        }

        stage('Publish Allure Report') {
            steps {
                allure([
                    includeProperties: false,
                    jdk: '',
                    reportBuildPolicy: 'ALWAYS',
                    results: [[path: 'allure-results']]
                ])
            }
        }
    }

    post {
        always {
            // Lưu các file báo cáo, log, v.v.
            archiveArtifacts artifacts: '**/allure-report/*', allowEmptyArchive: true
        }
    }
}
