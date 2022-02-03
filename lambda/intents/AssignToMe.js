'use strict';

const jira = require('../jira/services.js');

module.exports = async (userStory) => {

    const issueId = await jira.getIssueId(userStory);
    const myAccountId = await jira.getMyAccountId();
    await jira.updateIssueAssignee(issueId, myAccountId);

    return `Okay, the user story related to the ${userStory} was assigned to you.`;

};