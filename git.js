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
  // const branchArrayToCheckPR = util.removeNotAllowed(
  //   branchArrayWithoutFilter,
  //   notAllowedBranches,
  // );
  return branchArrayWithoutFilter;
};

const getNonCreatedPRBranches = async arrayBranches => {
  const tokenAuth = token.getTokenAuth();
  await inicialize(tokenAuth);
  const listPR = await githubAPI.listPR();

  const res = arrayBranches.filter(branch => {
    return !existPullRequestOfBranch(branch, listPR[0]);
  });

  return res;
};

const Check = () => {
  const currentBranch = gitCommand.getCurrentBranch();
  const notAllowedBranches = {
    staging: true,
    beta: true,
    master: true,
    dev2: true,
  };
  return currentBranch in notAllowedBranches;
};

module.exports = {
  getBranchesPendingToPush,
  getNonCreatedPRBranches,
  Check,
};

//r1 skdks
//bla bla bla
//r6
//r10
//r11