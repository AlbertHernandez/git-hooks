const cp = require('child_process');

const execute = command =>
  cp
    .execSync(command)
    .toString()
    .trim();

const getURLGitHub = () =>
  execute('git config --get remote.origin.url')
    .split('git@github.com:')[1]
    .split('.git')[0];

const getCurrentBranch = () => execute('git rev-parse --abbrev-ref HEAD');

const getIDCommitNotPushInBranch = branch => {
  const res = cp
    .execSync(`git log origin/${branch}..HEAD --format="%H"`)
    .toString()
    .split('\n')
    .map(id => {
      return id.substr(0, 7);
    });
  res.pop();
  return res;
};

const getBranchesContainsCommitIDWithoutClean = commitID =>
  cp
    .execSync(`git branch --contains ${commitID}`)
    .toString()
    .split('\n');

module.exports = {
  getURLGitHub,
  getCurrentBranch,
  getIDCommitNotPushInBranch,
  getBranchesContainsCommitIDWithoutClean,
};
