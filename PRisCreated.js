const githubAPI = require('./githubAPI');
const { spawn } = require('child_process');
const util = require('util');

const existPullRequestInBranch = async (branchName) => {

  const pullRequestArray = await githubAPI.listAllPR();

  

  const exists = existPullRequestOfBranch(branchName, pullRequestArray);

  
  

  console.log('salida: ', exists);
  
  return exists
}

const existPullRequestOfBranch = (branch, pullRequestArray) => {
  return pullRequestArray.map(pr => pr.head.ref)
                         .filter(prBranch => prBranch === branch)
                         .length === 1 ? true : false;
}

const inicialize = async (token, repo) => {
  const client = githubAPI.initClient(token);
  const userName = await githubAPI.getUserName();
  const urlRepo = userName + '/'+repo;
  const ghrepo = githubAPI.initRepo(urlRepo);
}

var args = process.argv.slice(2);
// const branchName = args[0];
// const tokenAuth = args[1];

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

const branchName = 'prueba2';
const tokenAuth = 'ae7808ada3d9133b6dfffceb4d661a0278ca1794';
const repogh = 'todo-reactjs'

// inicialize(tokenAuth, repogh);
// existPullRequestInBranch(branchName);



module.exports = {
  existPullRequestInBranch, 
  undoLastMerge,
  findIdLastCommit,
  inicialize
}