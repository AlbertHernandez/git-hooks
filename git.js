#!/usr/bin/env node

const githubAPI = require('./githubAPI');
const util = require('./.git/hooks/util/util');
const gitCommand = require('./gitCommands');
const token = require('./token');
const ghAPI = require('./ghAPI');

const notAllowedBranches = {
  staging: true,
  beta: true,
  master: true,
  'remove-octonode': true,
};

const inicialize = async tokenAuth => {
  // githubAPI.initClient(tokenAuth);
  // const urlRepo = gitCommand.getURLGitHub();
  // githubAPI.initRepo(urlRepo);
  ghAPI.configToken(tokenAuth);
};

const existPullRequestOfBranch = (branch, pullRequestArray = []) => 
  pullRequestArray
    .map(pr => pr.head.ref)
    .filter(prBranch => prBranch === branch).length === 1;

const getBranchesContainsCommitID = arrayBranches => {
  const array = util.removeWhiteSpaces(
    arrayBranches.reduce(
      (previous, commitID) => [
        ...previous,
        ...gitCommand.getBranchesContainsCommitIDWithoutClean(commitID),
      ],
      [],
    ),
  );
  const withoutRepites = util.removeDuplicates(array);
  return util.removeFirst2Caracters(withoutRepites);
};

const getBranchesPendingToPush = () => {
  const currentBranch = gitCommand.getCurrentBranch();
  const IDCommitNotPush = gitCommand.getIDCommitNotPushInBranch(currentBranch);
  const branchArrayWithoutFilter = getBranchesContainsCommitID(IDCommitNotPush);
  const branchArrayToCheckPR = util.removeNotAllowed(
    branchArrayWithoutFilter,
    notAllowedBranches,
  );
  return branchArrayToCheckPR;
};

const getNonCreatedPRBranches = async arrayBranches => {
  const tokenAuth = token.getTokenAuth();
  await inicialize(tokenAuth);
  const urlRepo = gitCommand.getURLGitHub();
  const path = `/repos/${urlRepo}/pulls`;
  const listPR = await ghAPI.fetchInfoFromGHAPI(path);
  console.log('listPR: ', listPR);
  // process.exit(1);
  const res = arrayBranches.filter(branch => {
    return !existPullRequestOfBranch(branch, listPR[0]);
  });

  return res;
};

const Check = () => {
  const currentBranch = gitCommand.getCurrentBranch();
  return currentBranch in notAllowedBranches;
};

module.exports = {
  getBranchesPendingToPush,
  getNonCreatedPRBranches,
  Check,
};

//prueba10
