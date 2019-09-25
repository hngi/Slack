"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.warningResponse = exports.successResponse = void 0;

/**
 * success: prepare json response for API endpoint
 * @param {object} res response object
 * @param {Number} statusCode success status code of response
 * @param {object} payload Object data corresponding with success status code
 * @returns {object} json response object
*/
var successResponse = function successResponse(res, statusCode, payload) {
  return res.status(statusCode).json({
    status: 'success',
    payload: payload
  });
};
/**
 * error: prepare json response for API endpoint
 * @param {object} res response object
 * @param {Number} statusCode error status code of response
 * @param {object} errors error message corresponding with status code
 * @returns {object} json response object
*/


exports.successResponse = successResponse;

var warningResponse = function warningResponse(res, statusCode, error) {
  return res.status(statusCode).json({
    status: 'error',
    error: error
  });
};

exports.warningResponse = warningResponse;