const githubAPI = require('./githubAPI');
const { spawn } = require('child_process');
const util = require('util');

const existPullRequestInBranch = async (branchName) => {
  const pullRequestArray = await githubAPI.listAllPR();

  const exists = existPullRequestOfBranch(branchName, pullRequestArray);
  console.log('salida: ', exists);
  return exists
}

const existPullRequestOfBranch = (branch, pullRequestArray = []) => {
  return pullRequestArray.map(pr => pr.head.ref)
                         .filter(prBranch => prBranch === branch)
                         .length === 1 ? true : false;
}

const inicialize = async (token) => {
  console.log('token: ', token);
  
  const client = githubAPI.initClient(token);
  

  const urlRepo = getURLGitHub();
  
  const ghrepo = githubAPI.initRepo(urlRepo);
  

}

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
  .execSync('git log --format="%H" -n 1')
  .toString().trim()
}



const getURLGitHub = () => {
  return require('child_process')
  .execSync('git config --get remote.origin.url')
  .toString().trim().split('git@github.com:')[1].split('.git')[0]
}

const getCurrentBranch = () => {
  return require('child_process')
  .execSync('git rev-parse --abbrev-ref HEAD')
  .toString();
}

const getBranchMerged = () => {
  return require('child_process')
  .execSync('git reflog -1 | cut -d" " -f 4 | sed "s/://"')
  .toString().trim();
}

const getLast10 = () => {
  return require('child_process')
  .execSync('git reflog -10 | cut -d" " -f 4 | sed "s/://"')
  .toString().trim();
}


// const branchName = 'NewRama8';master
// const tokenAuth = 'ae7808ada3d9133b6dfffceb4d661a0278ca1794';

// inicialize(tokenAuth);
// existPullRequestInBranch(branchName);s
//rama 10
//rama 10 tu puta madre 2222 master conflicto haciendo nuevo oijijojiojojoj

module.exports = {
  existPullRequestInBranch, 
  undoLastMerge,
  findIdLastCommit,
  inicialize,
  getCurrentBranch,
  getBranchMerged,
  getLast10
}