const githubAPI = require('./githubAPI');
const { spawn } = require('child_process');
const util = require('util');

const inicialize = async (token) => {
  const client = githubAPI.initClient(token);
  const urlRepo = getURLGitHub();
  const ghrepo = githubAPI.initRepo(urlRepo);
}

const existPullRequestInBranch = async (branchName) => {
  const pullRequestArray = await githubAPI.listAllPR();
  return existPullRequestOfBranch(branchName, pullRequestArray);
}

const existPullRequestOfBranch = (branch, pullRequestArray = []) => {
  return pullRequestArray.map(pr => pr.head.ref)
                         .filter(prBranch => prBranch === branch)
                         .length === 1 ? true : false;
}

const getURLGitHub = () => {
  return require('child_process')
  .execSync('git config --get remote.origin.url')
  .toString().trim().split('git@github.com:')[1].split('.git')[0]
}

const getCurrentBranch = () => {
  return require('child_process')
  .execSync('git rev-parse --abbrev-ref HEAD')
  .toString().trim();
}

const getIDCommitNotPushInBranch = (branch) => {
  const command = 'git log origin/' + branch + '..HEAD --format="%H"'
  
  var res = require('child_process')
  .execSync(command)
  .toString().split('\n').map(function(id) {
    return id.substr(0,7);
  })
  res.pop();
  return res;
}

const getBranchesContainsCommitID = (commitID) => {
  const command = 'git branch --contains ' + commitID
  let res = require('child_process')
  .execSync(command)
  .toString().split('\n')
  return res;
}

module.exports = {
  existPullRequestInBranch, 
  inicialize,
  getCurrentBranch,
  getIDCommitNotPushInBranch,
  getBranchesContainsCommitID,
}