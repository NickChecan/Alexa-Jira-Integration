'use strict';

const AWS = require('aws-sdk');
const STS = new AWS.STS({ apiVersion: '2011-06-15' });

const SECRET_MANAGER_ARN = '<YOUR SECRET MANAGER ARN>';

// Call the AWS API and return a Promise
function getAwsSecret(client, secretName) {
    return client.getSecretValue({ SecretId: secretName }).promise();
}

// Create a async function to use the Promise
// Top level await is a proposal
async function getAwsSecretAsync() {
    
    // Assume role to access the Secrets Manager service from a personal AWS account
    const credentials = await STS.assumeRole({
        RoleArn: '<IAM ROLE ARN TO ALLOW THE ALEXA LAMBDA TO GET PERMISSION TO USE THE SECRET MANAGER>',
        RoleSessionName: 'AlexaSkillRoleSession' // You can rename it!
    }, (err, res) => {
        if (err) {
            console.log('AssumeRole FAILED: ', err);
            throw new Error('Error while assuming role');
        }
        return res;
    }).promise();
    
    // Create the SecretsManager client considering the assumed role
    const client = new AWS.SecretsManager({
        accessKeyId: credentials.Credentials.AccessKeyId,
        secretAccessKey: credentials.Credentials.SecretAccessKey,
        sessionToken: credentials.Credentials.SessionToken
    });
    
    var response = await this.getAwsSecret(client, SECRET_MANAGER_ARN).catch(err => {
        console.log(err);
        console.log("Values couldn't be retrieved from the Secret Manager");
    });
    return JSON.parse(response.SecretString);
}

module.exports = { getAwsSecret, getAwsSecretAsync };