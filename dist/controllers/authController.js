"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAuth = exports.authenticateAppRedirect = exports.authenticateApp = void 0;

var _request = _interopRequireDefault(require("request"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _config = require("../config/config");

var _slackRequest = require("../helpers/slackRequest");

var _messages = require("../helpers/messages");

_dotenv["default"].config();

var authenticateApp = function authenticateApp(req, res) {
  res.sendFile("".concat(__dirname, "/add_to_slack.html"));
};

exports.authenticateApp = authenticateApp;

var authenticateAppRedirect = function authenticateAppRedirect(req, res) {
  var options = {
    uri: "https://slack.com/api/oauth.access?code=".concat(req.query.code, "&client_id=").concat(_config.CLIENT_ID, "&client_secret=").concat(_config.CLIENT_SECRET),
    method: 'GET'
  };
  (0, _request["default"])(options, function (error, response, body) {
    var JSONresponse = JSON.parse(body);

    if (!JSONresponse.ok) {
      res.send("Error encountered: \n".concat(JSON.stringify(JSONresponse))).status(200).end();
    }

    process.env.BOT_TOKEN = JSONresponse.access_token;
    res.redirect('https://priapus.slack.com/apps/ANFETCSN5-priapus-saver');
  });
};

exports.authenticateAppRedirect = authenticateAppRedirect;

var checkAuth = function checkAuth(req, res, next) {
  var payload = req.body;

  if (!payload.token) {
    res.status(403).end('Access forbidden');
    var responseURL = payload.response_url;
    var postOptions = (0, _slackRequest.prepareRequestMessage)('POST', responseURL, _messages.forbiddenMessage);
    (0, _request["default"])(postOptions, function (error, response, body) {
      if (error) {
        console.log(error);
      }
    });
    return;
  }

  next();
};

exports.checkAuth = checkAuth;