agentName = 'master'
pipeline {
  agent {label agentName}
    
 // tools {nodejs "node"}
    
  stages {
        
    stage('Code Analysis') {
      steps {
        git branch: 'develop',
            credentialsId: 'a7e32b0a-b2af-426b-8042-af214734f21e', 
            url: 'http://build@10.1.1.10:8080/scm/git/HRMS-User'
      }
    }
        
    stage('Install Dependencies') {
      steps {
         sh 'npm install'
    //     //sh 'npm install supervisor --save'
       }
    }
     
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
    
    stage('Deploy'){
        steps{
            sh 'sshpass -p "sevalg2014" ssh root@antlet14 -o StrictHostKeyChecking=no "rm -rf /var/www/temp-deploy/dist/HRMS-User"'
            sh 'sshpass -p "sevalg2014" ssh root@antlet14 "mkdir -p /var/www/temp-deploy/dist/HRMS-User"'
            sh 'sshpass -p "sevalg2014" scp -r * root@antlet14:/var/www/temp-deploy/dist/HRMS-User/'
            sh 'sshpass -p "sevalg2014" ssh root@antlet14 "pm2 stop /var/www/HRMS/HRMS-User/server.js"'
            sh 'sshpass -p "sevalg2014" ssh root@antlet14 "rm -rf /var/www/HRMS/HRMS-User/"'
            sh 'sshpass -p "sevalg2014" ssh root@antlet14 "mv /var/www/temp-deploy/dist/HRMS-User/ /var/www/HRMS/"'
            sh 'sshpass -p "sevalg2014" ssh root@antlet14 "rm -r /var/www/HRMS/HRMS-User/node_modules /var/www/HRMS/HRMS-User/package-lock.json"'
            sh 'sshpass -p "sevalg2014" ssh root@antlet14 "cd /var/www/HRMS/HRMS-User && npm install && npm install && pm2 start server.js"'
        }
    }
  }
   post{
      success{
          echo 'This will run only if successful' 
      }
      failure {
          emailext body: '$DEFAULT_CONTENT', recipientProviders: [culprits(), developers()], subject: '$DEFAULT_SUBJECT', to: '$DEFAULT_RECIPIENTS'
          emailextrecipients([developers()])
      }
      unstable {  
             echo 'This will run only if the run was marked as unstable'  
         }  
         changed {  
             echo 'This will run only if the state of the Pipeline has changed'  
             echo 'For example, if the Pipeline was previously failing but is now successful'  
         }  
  }
}