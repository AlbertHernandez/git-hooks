const githubAPI = require('./githubAPI')
const util = require('util')
const utilidades = require('./.git/hooks/util/util')

const inicialize = async (token) => {
  const client = githubAPI.initClient(token)
  const urlRepo = getURLGitHub()
  const ghrepo = githubAPI.initRepo(urlRepo)
}

const existPullRequestInBranch = async (branchName) => {
  const pullRequestArray = await githubAPI.listAllPR()
  return existPullRequestOfBranch(branchName, pullRequestArray)
}

const existPullRequestOfBranch = (branch, pullRequestArray = []) => {
	return pullRequestArray.map(pr => pr.head.ref)
    .filter(prBranch => prBranch === branch)
    .length === 1
}

const getURLGitHub = () => {
  return require('child_process')
    .execSync('git config --get remote.origin.url')
    .toString().trim().split('git@github.com:')[1].split('.git')[0]
}

const getCurrentBranch = () => {
  return require('child_process')
    .execSync('git rev-parse --abbrev-ref HEAD')
    .toString().trim()
}

const getIDCommitNotPushInBranch = (branch) => {
  const command = 'git log origin/' + branch + '..HEAD --format="%H"'
  var res = require('child_process')
    .execSync(command)
    .toString().split('\n').map(function (id) {
      return id.substr(0, 7)
    })
  res.pop()
  return res
}

const getBranchesContainsCommitIDWithoutClean = (commitID) => {
  const command = 'git branch --contains ' + commitID
  let res = require('child_process')
    .execSync(command)
    .toString().split('\n')

  return res
}

const getBranchesContainsCommitID = arrayBranches => {
  var array = utilidades.removeWhiteSpaces(arrayBranches.reduce(function (previus, commitID) {
    // console.log('commit: ', commitID, ' -g etBranchesFromCommitID: ' ,getBranchesContainsCommitID(commitID));
    return [...previus, ...getBranchesContainsCommitIDWithoutClean(commitID)]
  }, []))
  const sinRepes = utilidades.removeDuplicates(array)
  return utilidades.removeFirst2Caracters(sinRepes)
}

module.exports = {
  existPullRequestInBranch,
  inicialize,
  getCurrentBranch,
  getIDCommitNotPushInBranch,
  getBranchesContainsCommitID
}

//skdksfssdfsd
