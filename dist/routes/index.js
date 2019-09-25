"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _responseHelper = require("../helpers/responseHelper");

var _authController = require("../controllers/authController");

var _slackController = require("../controllers/slackController");

/* eslint-disable max-len */

/**
 * @fileOverview This file manages all routes in the application
 * @requires ../helpers/responseHelper
 * @requires ../controllers/slackController
 * @param {object} app
 * @exports routes.js
 */
var routes = function routes(app) {
  app.get('/auth', _authController.authenticateApp);
  app.get('/auth/redirect', _authController.authenticateAppRedirect);
  app.post('/export-command', _authController.checkAuth, _slackController.getSlashCommandInfo);
  app.post('/slack/actions', _slackController.initButtonConfirmation, _slackController.getConversationsHistory);
};

var _default = routes;
exports["default"] = _default;