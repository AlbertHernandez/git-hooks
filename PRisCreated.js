const githubAPI = require('./githubAPI');
const { spawn } = require('child_process');
const util = require('util');

const existPullRequestInBranch = async (branchName, token, repo) => {
  // const repo = 'AlbertHernandez/todo-reactjs'
  githubAPI.initialize(token, repo);
  const pullRequestArray = await githubAPI.listAllPR();
  const exists = existPullRequestOfBranch(branchName, pullRequestArray);
  return exists
}

const existPullRequestOfBranch = (branch, pullRequestArray) => {
  return pullRequestArray.map(pr => pr.head.ref)
                         .filter(prBranch => prBranch === branch)
                         .length === 1 ? true : false;
}

var args = process.argv.slice(2);
const branchName = args[0];
const tokenAuth = args[1];

const undoLastMerge = () => {

  const commandUndoMerge = 'git reset --hard HEAD~1'
  
  const exec = util.promisify(require('child_process').exec);

  async function deshacerMerge() {
    const { stdout, stderr } = await exec(commandUndoMerge);
  }
  deshacerMerge();
}

const findIdLastCommit = () => {
  return require('child_process')
  .execSync('git rev-parse HEAD')
  .toString().trim()
}

module.exports = {
  existPullRequestInBranch, 
  undoLastMerge,
  findIdLastCommit
}