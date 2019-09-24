/* eslint-disable no-unused-vars */

export const prepareRequestMessage = (responseURL, JSONmessage) => ({
  uri: responseURL,
  method: 'POST',
  headers: {
    'Content-type': 'application/json',
  },
  json: JSONmessage,
});
