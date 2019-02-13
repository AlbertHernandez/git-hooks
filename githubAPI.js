var github = require('octonode');
let ghrepo;

const initialize = (token, repositorio) => {
  const client = github.client(token);
  ghrepo = client.repo(repositorio);
}

const listAllPR = () => {
  return new Promise((resolve, reject) => {
    ghrepo.prs((_, pullRequestArray)=> {
      resolve(pullRequestArray);
    });
  });
} 

module.exports = {
  listAllPR, 
  initialize,
}