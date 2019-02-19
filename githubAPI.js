var github = require('octonode');
let ghrepo
let client

const initClient = token => {
  client = github.client(token);
};

const initRepo = repositorio => {
  ghrepo = client.repo(repositorio);
};

const listPR = async () => {
  const result = await ghrepo.prsAsync({ per_page: 100 });
  return result;
};

module.exports = {
  initClient,
  initRepo,
  listPR,
};
