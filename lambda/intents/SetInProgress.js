'use strict';

const jira = require('../jira/services.js');

module.exports = async (userStory) => {
    
    // Update issue status to IN_PROGRESS
    const issueId = await jira.getIssueId(userStory);
    await jira.executeTransition(issueId, jira.TRANSITION_IN_PROGRESS);
    
    // Update assignee
    const myAccountId = await jira.getMyAccountId();
    await jira.updateIssueAssignee(issueId, myAccountId);

    return `Okay, the user story related to the ${userStory} was set to In Progress`;

};