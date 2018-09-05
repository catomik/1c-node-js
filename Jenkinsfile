node {
    wrap([$class: 'AnsiColorBuildWrapper']) {
    withCredentials([
                        [
                            $class: 'UsernamePasswordMultiBinding',
                            credentialsId: 'bluemix-viktor',
                            usernameVariable: 'BX_USER',
                            passwordVariable: 'BX_PASSWORD'
                        ]
                        ]) {
            stage('Clean') {
                deleteDir()
            }
            stage('Checkout') {
                git branch: 'master', credentialsId: 'bitbucket-ssh-viktor', url: 'git@bitbucket.org:asteriainc/fortnox.git'
                // Fix issue with push
                sh 'git branch --set-upstream-to=origin/master master'
            }
            stage('Check committer') {
                if (helpers.isCommitter('asteria-ci')) {
                    error("Last commit made by Jenkins. Aborting build.")
                }
            }
            stage('Install dependencies') {
                sh "npm install"
            }
            stage('Set up Docker') {
                sh "bx login -a https://api.eu-gb.bluemix.net -u $BX_USER -p $BX_PASSWORD -c 99bcfbddeb2fe3d18833d586790a0057 -o asteria -s dev"
                sh "bx ic init"
            }
			withEnv([
				'DOCKER_HOST=tcp://containers-api.eu-gb.bluemix.net:8443',
             	'DOCKER_CERT_PATH=/var/lib/jenkins/.ice/certs/containers-api.eu-gb.bluemix.net/6b321e59-2ec8-45a7-81a8-c547daf3c479',
				'DOCKER_TLS_VERIFY=1',
				'COMPOSE_PROJECT_NAME=asteria',
                'PROJECT_VERSION=' + helpers.getFromPackageJson()
			]) {
				stage('Release') {
					//helpers.buildDockerImage('auth-service', helpers.getFromPackageJson())
					sh "docker-compose -f docker-compose.production.yml build"
					sh "npm version patch"
					sh "git push"
				}
			 }
        }
    }
}
