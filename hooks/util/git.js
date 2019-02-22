#!/usr/bin/env node

const util = require('./util');
const gitCommand = require('./gitCommands');
const token = require('./token');
const ghAPI = require('./ghAPI');

const notAllowedBranches = {
  staging: true,
  beta: true,
  master: true,
  dev4: true,
};

const inicialize = async tokenAuth => {
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

  const res = arrayBranches.filter(branch => {
    return !existPullRequestOfBranch(branch, listPR);
  });

  return res;
};

const Check = () => {
  const currentBranch = gitCommand.getCurrentBranch();
  return currentBranch in notAllowedBranches;
};

const getNumberPR = async branches => {
  const urlRepo = gitCommand.getURLGitHub();
  const path = `/repos/${urlRepo}/pulls`;
  const listPR = await ghAPI.fetchInfoFromGHAPI(path);
  const res = listPR
    .filter(pr => branches.includes(pr.head.ref))
    .map(pr => pr.number);
  return res;
};

const putLabelInBranches = async branches => {
  const urlRepo = gitCommand.getURLGitHub();
  const tokenAuth = token.getTokenAuth();
  await inicialize(tokenAuth);
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

console.log('hola mundo');
