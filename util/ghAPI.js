const https = require('https');

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

const putLabelsInPR = async (path, labelsArray) => {
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
  const response = await makeRequest(options, formData);
  return response;
};

// const launch = async () => {
//   console.log('hola mundo');
//   configToken('ae7808ada3d9133b6dfffceb4d661a0278ca1794');
//   // const pr = await fetchInfoFromGHAPI('/repos/AlbertHernandez/hook/pulls');
//   const pr = await putLabelsInPR('/repos/AlbertHernandez/hook/issues/7/labels', ['toni']);
//   console.log('prueba: ', pr);
// };

// launch();

module.exports = {
  configToken,
  fetchInfoFromGHAPI,
  putLabelsInPR,
};
