var github = require('octonode');
let ghrepo;
let client;

const initClient = token => {
  return client = github.client(token);
}

const initRepo = repositorio => {
  return ghrepo = client.repo(repositorio);
}

const listAllPR = () => {
  return new Promise((resolve, reject) => {
    ghrepo.prs((_, pullRequestArray)=> {
      resolve(pullRequestArray);
    });
  });
}

// const getUserName = () => {
//   return new Promise((resolve, reject) => {
//     client.get('/user', {}, function (err, status, body, headers) {
//       const userName = body.login
//       resolve(userName)
//     });
//   });

  // client.get('/user', {}, function (err, status, body, headers) {
  //   const userName = body.login
  //   //console.log(userName); //json object
  //   return userName
  // });
//}

// initClient('ae7808ada3d9133b6dfffceb4d661a0278ca1794');
// initRepo('AlbertHernandez/hook');
//bla bla blasdsdfdffsdsd
module.exports = {
  initClient,
  initRepo,
  listAllPR,
}