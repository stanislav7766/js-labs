import {
  resFailed,
  resOK,
  checkSuccess,
  applyStyles,
} from './modules/helpers.js';
import { URL, nodes } from './modules/data.js';

const makeRequest = async (type, url = URL) =>
  new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.open(type, url);
    request.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    request.addEventListener('readystatechange', () => {
      request.readyState === 4 &&
        resolve(checkSuccess(request) ? resOK() : resFailed());
    });
    request.send();
  });

(async () => {
  await Promise.all(
    nodes.map(async ({ method, className }) => {
      const { text, textStyle } = await makeRequest(method);
      applyStyles({ className, text, textStyle });
    })
  );
})();
