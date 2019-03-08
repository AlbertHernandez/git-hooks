const https = require('https');
const qs = require('querystring');

let tokenGH;

const configToken = newToken => {
  tokenGH = newToken;
};

const makeRequest = (options, dataToSend = false) => {
  return new Promise((resolve, reject) => {
    let data = '';
    const req = https.request(options, res => {
      res.on('data', chunk => {
        data += chunk.toString('utf8');
      });
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    });

    req.on('error', e => {
      reject(e);
    });

    if (dataToSend !== false) {
      req.write(dataToSend);
    }

    req.end();
  });
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

  return makeRequest(options);
};

const putLabelsInPR = (path, labelsArray) => {
  const formData = JSON.stringify({
    labels: labelsArray,
  });

  const options = {
    host: 'api.github.com',
    path,
    method: 'POST',
    headers: {
      Authorization: `token ${tokenGH}`,
      'user-agent': 'node.js',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': formData.length,
    },
  };
  return makeRequest(options, formData);
};

module.exports = {
  configToken,
  fetchInfoFromGHAPI,
  putLabelsInPR,
};
