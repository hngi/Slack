/* eslint-disable no-unused-vars */

export const prepareRequestMessage = (method, responseURL, JSONmessage) => ({
  uri: responseURL,
  method,
  headers: {
    'Content-type': 'application/json',
  },
  json: JSONmessage,
});
