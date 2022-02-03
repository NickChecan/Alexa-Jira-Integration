'use strict';

const axios = require("axios");

const secretManager = require('../secret-manager.js');

const TRANSITION_DONE = "31";
const TRANSITION_IN_PROGRESS = "21";

async function getAuthHeader() {
    const secrets = await secretManager.getAwsSecretAsync();
    return { 
        auth: {
            username: secrets.JIRA_USERNAME,
            password: secrets.JIRA_PASSWORD
        }
    };
}

async function getIssueId(userStory) {
    
    const secrets = await secretManager.getAwsSecretAsync();
    const JIRA_DOMAIN = secrets.JIRA_DOMAIN;
    const JIRA_PROJECT = secrets.JIRA_PROJECT;

    const BASE_URL = `${JIRA_DOMAIN}/rest/api/3/search`;
    const params = encodeURI(`project = '${JIRA_PROJECT}' AND summary ~ '${userStory}'`);
    const endpoint = `${BASE_URL}?jql=${params}`;

    const response = await axios.get(endpoint, await getAuthHeader());
    return response.data.issues[0].id; 

}

async function executeTransition(issueId, transition) {
    
    const secrets = await secretManager.getAwsSecretAsync();
    const JIRA_DOMAIN = secrets.JIRA_DOMAIN;

    const endpoint = `${JIRA_DOMAIN}/rest/api/3/issue/${issueId}/transitions`;
    axios.post(endpoint, { "transition": { "id": transition } }, await getAuthHeader());

}

async function getMyAccountId() {
    
    const secrets = await secretManager.getAwsSecretAsync();
    const JIRA_DOMAIN = secrets.JIRA_DOMAIN;
    
    const endpoint = `${JIRA_DOMAIN}/rest/api/latest/user/search?query=${secrets.JIRA_USERNAME}`;
    const response = await axios.get(endpoint, await getAuthHeader());
    
    return response.data[0].accountId;
    
}

async function updateIssueAssignee(issueId, accountId) {
    
    const secrets = await secretManager.getAwsSecretAsync();
    const JIRA_DOMAIN = secrets.JIRA_DOMAIN;

    const endpoint = `${JIRA_DOMAIN}/rest/api/3/issue/${issueId}/assignee`;
    axios.put(endpoint, { "accountId": accountId }, await getAuthHeader());
    
}

module.exports = { 
    TRANSITION_DONE, 
    TRANSITION_IN_PROGRESS, 
    getIssueId, 
    executeTransition,
    getMyAccountId,
    updateIssueAssignee
};