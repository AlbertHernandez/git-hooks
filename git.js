const util = require('util')
const githubAPI = require('./githubAPI')
const utilidades = require('./.git/hooks/util/util');

const tokenAuth = 'ae7808ada3d9133b6dfffceb4d661a0278ca1794';

const inicialize = async token => {
  const client = githubAPI.initClient(token);
  const urlRepo = getURLGitHub();
  const ghrepo = githubAPI.initRepo(urlRepo);
};

const existPullRequestInBranch = async branchName => {
  const pullRequestArray = await githubAPI.listAllPR();
  return existPullRequestOfBranch(branchName, pullRequestArray);
};

const existPullRequestOfBranch = (branch, pullRequestArray = []) => {
  return (
    pullRequestArray
      .map(pr => pr.head.ref)
      .filter(prBranch => prBranch === branch).length === 1
  );
};

const getURLGitHub = () => {
  return require('child_process')
    .execSync('git config --get remote.origin.url')
    .toString()
    .trim()
    .split('git@github.com:')[1]
    .split('.git')[0];
};

const getCurrentBranch = () => {
  return require('child_process')
    .execSync('git rev-parse --abbrev-ref HEAD')
    .toString()
    .trim();
};

const getIDCommitNotPushInBranch = branch => {
  const command = `git log origin/${  branch  }..HEAD --format="%H"`;
  let res = require('child_process')
    .execSync(command)
    .toString()
    .split('\n')
    .map(function(id) {
      return id.substr(0, 7);
    });
  res.pop();
  return res;
};

const getBranchesContainsCommitIDWithoutClean = commitID => {
  const command = `git branch --contains ${  commitID}`;
  const res = require('child_process')
    .execSync(command)
    .toString()
    .split('\n');

  return res;
};

const getBranchesContainsCommitID = arrayBranches => {
  const array = utilidades.removeWhiteSpaces(
    arrayBranches.reduce(function(previus, commitID) {
      return [...previus, ...getBranchesContainsCommitIDWithoutClean(commitID)];
    }, []),
  );
  const sinRepes = utilidades.removeDuplicates(array);
  return utilidades.removeFirst2Caracters(sinRepes);
};

const getBranchesPendingToPush = () => {
  const currentBranch = getCurrentBranch();
  const notAllowedBranches = {
    staging: true,
    beta: true,
    master: true,
    // [currentBranch]: true
  };
  const IDCommitNotPush = getIDCommitNotPushInBranch(currentBranch);
  const branchArrayWithoutFilter = getBranchesContainsCommitID(IDCommitNotPush);
  const branchArrayToCheckPR = utilidades.removeNotAllowed(
    branchArrayWithoutFilter,
    notAllowedBranches,
  );
  return branchArrayToCheckPR;
};

const getNonCreatedPRBranches = async arrayBranches => {
  await inicialize(tokenAuth);
  return await arrayBranches.filter(async function(branch) {
    return !(await existPullRequestInBranch(branch));
  });
};

module.exports = {
  existPullRequestInBranch,
  inicialize,
  getCurrentBranch,
  getIDCommitNotPushInBranch,
  getBranchesContainsCommitID,
  getBranchesPendingToPush,
  getNonCreatedPRBranches
};

// skdksfssdfsddfdfsd
