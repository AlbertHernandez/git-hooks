const githubAPI = require('./githubAPI');

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

//akkssdfasas HOLAsdfsdsdsdsdfsdsdsdassdsdssdsdsd
// hola mundo
//desde rama2
//rama2
module.exports = {
  existPullRequestInBranch, 
}