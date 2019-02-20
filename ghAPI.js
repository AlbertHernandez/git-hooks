const https = require('https');

const apiGH = 'api.github.com';
let tokenGH;

const configToken = newToken => {
  tokenGH = newToken;
};

const fetchInfoFromGHAPI = path => {
  const options = {
    host: 'api.github.com',
    path,
    method: 'GET',
    headers: {
      Authorization: `token ${tokenGH}`,
      'user-agent': 'node.js',
    },
  };

  return new Promise((resolve, reject) => {
    // Do async job
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
};

const launch = async () => {
  try {
    const token = 'ae7808ada3d9133b6dfffceb4d661a0278ca1794';
    configToken(token);
    const client = await fetchInfoFromGHAPI(
      '/repos/AlbertHernandez/hook/pulls',
    );
    console.log('client: ', client);
  } catch (error) {
    console.log('Error: ', error);
  }
};
