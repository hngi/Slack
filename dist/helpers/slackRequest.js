"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareRequestMessage = void 0;

/* eslint-disable no-unused-vars */
var prepareRequestMessage = function prepareRequestMessage(method, responseURL, JSONmessage) {
  return {
    uri: responseURL,
    method: method,
    headers: {
      'Content-type': 'application/json'
    },
    json: JSONmessage
  };
};

exports.prepareRequestMessage = prepareRequestMessage;