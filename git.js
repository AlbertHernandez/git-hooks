#!/usr/bin/env node

const githubAPI = require('./githubAPI');
const util = require('./.git/hooks/util/util');
const gitCommand = require('./gitCommands');
const token = require('./token');

const inicialize = async tokenAuth => {
  githubAPI.initClient(tokenAuth);
  const urlRepo = gitCommand.getURLGitHub();
  githubAPI.initRepo(urlRepo);
};

const existPullRequestOfBranch = (branch, pullRequestArray = []) =>
  pullRequestArray
    .map(pr => pr.head.ref)
    .filter(prBranch => prBranch === branch).length === 1;

const existPullRequestInBranch = async branchName => {
  const pullRequestArray = await githubAPI.listAllPR();
  return existPullRequestOfBranch(branchName, pullRequestArray);
};

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
  const sinRepes = util.removeDuplicates(array);
  return util.removeFirst2Caracters(sinRepes);
};

const getBranchesPendingToPush = () => {
  const currentBranch = gitCommand.getCurrentBranch();
  const notAllowedBranches = {
    staging: true,
    beta: true,
    master: true,
    // [currentBranch]: true
  };
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
  return arrayBranches.filter(
    async branch => !(await existPullRequestInBranch(branch)),
  );
};

module.exports = {
  getBranchesPendingToPush,
  getNonCreatedPRBranches,
};

// skdksfssdfsddfdfsd
