#!/usr/bin/env node

const util = require('./util');
const gitCommand = require('./gitCommands');
const token = require('./token');
const ghAPI = require('./ghAPI');

const notAllowedBranches = {
  staging: true,
  beta: true,
  master: true,
};

let pullRequest;

const inicialize = tokenAuth => {
  ghAPI.configToken(tokenAuth);
};

const getPullRequest = async () => {
  if (pullRequest !== undefined) {
    return pullRequest;
  }

  const tokenAuth = token.getTokenAuth();
  inicialize(tokenAuth);
  const urlRepo = gitCommand.getURLGitHub();
  const path = `/repos/${urlRepo}/pulls?state=all`;
  pullRequest = await ghAPI.fetchInfoFromGHAPI(path);
  return pullRequest;
};

const getBranchOfPr = pr => pr.head.ref;

const existPullRequestInBranches = (branches, pullRequestArray = []) => {
  const branchWithPR = {};
  const branchWithoutPR = {};
  branches.forEach(branch => {
    branchWithoutPR[branch] = true;
    if (!branchWithPR[branch]) {
      for (let indexPR = 0; indexPR < pullRequestArray.length; indexPR += 1) {
        const pr = getBranchOfPr(pullRequestArray[indexPR]);
        branchWithPR[pr] = true;
        if (pr === branch) {
          delete branchWithoutPR[branch];
          indexPR += 1;
          branchWithPR[branch] = true;
          break;
        }
      }
    } else {
      delete branchWithoutPR[branch];
      branchWithPR[branch] = true;
    }
  });
  return Object.keys(branchWithoutPR);
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
  const listPR = await getPullRequest();
  return existPullRequestInBranches(arrayBranches, listPR);
};

const Check = () => {
  const currentBranch = gitCommand.getCurrentBranch();
  return currentBranch in notAllowedBranches;
};

const getNumberPR = async branches => {
  const listPR = await getPullRequest();
  const res = listPR
    .filter(pr => branches.includes(pr.head.ref))
    .map(pr => pr.number);
  return res;
};

const putLabelInBranches = async branches => {
  const urlRepo = gitCommand.getURLGitHub();
  const tokenAuth = token.getTokenAuth();
  inicialize(tokenAuth);
  const numberOfAllPR = await getNumberPR(branches);
  const currentBranch = gitCommand.getCurrentBranch();
  const labels = [`Merged in ${currentBranch}`];
  numberOfAllPR.forEach(async numberOfPR => {
    const path = `/repos/${urlRepo}/issues/${numberOfPR}/labels`;
    await ghAPI.putLabelsInPR(path, labels);
  });
};

module.exports = {
  getBranchesPendingToPush,
  getNonCreatedPRBranches,
  Check,
  putLabelInBranches,
};
