const github = require('octonode');

let ghrepo;
let client;

const initClient = token => {
  client = github.client(token);
};

const initRepo = repositorio => {
  ghrepo = client.repo(repositorio);
};

const listAllPR = () => {
  return new Promise((resolve, reject) => {
    ghrepo.prs((_, pullRequestArray) => {
      resolve(pullRequestArray);
    });
  });
};

const pruebas = () => {
  console.log('haciendo pruebas');

};

module.exports = {
  initClient,
  initRepo,
  listAllPR,
  pruebas,
};
