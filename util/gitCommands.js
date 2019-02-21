const cp = require('child_process');

const execute = command => cp.execSync(command).toString();

const getURLGitHub = () =>
  execute('git config --get remote.origin.url')
    .split('git@github.com:')[1]
    .split('.git')[0]
    .trim();

const getCurrentBranch = () =>
  execute('git rev-parse --abbrev-ref HEAD').trim();

const getIDCommitNotPushInBranch = branch => {
  try {
    const res = execute(`git log origin/${branch}..HEAD --format="%H"`)
      .split('\n')
      .map(id => id.substr(0, 7));
    res.pop();
    return res;
  } catch (error) {
    console.log('Error: ', error);
  }
};

const getBranchesContainsCommitIDWithoutClean = commitID =>
  execute(`git branch --contains ${commitID}`).split('\n');

module.exports = {
  getURLGitHub,
  getCurrentBranch,
  getIDCommitNotPushInBranch,
  getBranchesContainsCommitIDWithoutClean,
};
