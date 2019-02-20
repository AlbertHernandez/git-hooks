const https = require('https');

let tokenGH;

const configToken = newToken => {
  tokenGH = newToken;
};

const makeRequest = options =>
  new Promise((resolve, reject) => {
    https
      .get(options, resp => {
        let data = '';

        resp.on('data', chunk => {
          data += chunk.toString('utf8');
        });

        resp.on('end', () => {
          resolve(JSON.parse(data));
        });
      })
      .on('error', err => {
        reject(err);
      });
  });

const fetchInfoFromGHAPI = async path => {
  const options = {
    host: 'api.github.com',
    path,
    method: 'GET',
    headers: {
      Authorization: `token ${tokenGH}`,
      'user-agent': 'node.js',
    },
  };

  const body = await makeRequest(options);
  return body;
};

module.exports = {
  configToken,
  fetchInfoFromGHAPI,
};
