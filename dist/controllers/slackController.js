"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initButtonConfirmation = exports.getSlashCommandInfo = exports.getConversationsHistory = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _request = _interopRequireDefault(require("request"));

var _slackRequest = require("../helpers/slackRequest");

var _config = require("../config/config");

var _googleController = require("./googleController");

/* eslint-disable max-len */
var getConversationsHistory = function getConversationsHistory(channelId) {
  var options = {
    uri: "https://priapus.slack.com/api/conversations.history?token=".concat(_config.BOT_TOKEN, "&channel=").concat(channelId),
    method: 'GET'
  };
  console.log(options);
  (0, _request["default"])(options, function (error, response, body) {
    var payload = JSON.parse(body);
    var data = payload.messages.map(function (msg) {
      return {
        by: msg.user,
        time: msg.ts,
        text: msg.text
      };
    });
    return data;
  });
};

exports.getConversationsHistory = getConversationsHistory;

var getSlashCommandInfo =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res) {
    var payload, responseURL, initMessage, authentication, postOptions, data, upload, _postOptions;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            res.status(200).end(); // best practice to respond with 200 status

            payload = req.body;
            responseURL = payload.response_url;
            _context.next = 5;
            return (0, _googleController.authorize)();

          case 5:
            authentication = _context.sent;
            console.log('authentication', authentication);

            if (!(typeof authentication === 'string')) {
              _context.next = 13;
              break;
            }

            initMessage = {
              text: "*Follow link below to allow Priapus Bot upload conversation to your drive*  \n\n ".concat(authentication, ". \n\nThen launch the command again")
            };
            postOptions = (0, _slackRequest.prepareRequestMessage)('POST', responseURL, initMessage);
            (0, _request["default"])(postOptions, function (error, response, body) {
              if (error) {
                console.log(error);
                return;
              }
            });
            _context.next = 20;
            break;

          case 13:
            data = getConversationsHistory(payload.channel_id); // upload to drive

            _context.next = 16;
            return (0, _googleController.uploadConversation)(authentication);

          case 16:
            upload = _context.sent;
            initMessage = {
              text: "Your conversation is saved to Google drive \n\n View it here https://drive.google.com/open?id=".concat(upload.id, "/view")
            };
            _postOptions = (0, _slackRequest.prepareRequestMessage)('POST', responseURL, initMessage);
            (0, _request["default"])(_postOptions, function (error, response, body) {
              if (error) {
                console.log(error);
                return;
              }
            });

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getSlashCommandInfo(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.getSlashCommandInfo = getSlashCommandInfo;

var initButtonConfirmation = function initButtonConfirmation(req, res, next) {
  var message;
  res.sendStatus(200).end(); // best practice to respond with 200 status

  var responsePayload = JSON.parse(req.body.payload);
  console.log(responsePayload);

  if (responsePayload.actions[0].name === 'cancel') {
    message = {
      text: "Bye ".concat(responsePayload.user.name)
    };
    var postOptions = (0, _slackRequest.prepareRequestMessage)('POST', responsePayload.response_url, message);
    (0, _request["default"])(postOptions, function (error, response, body) {
      if (error) {
        console.log(error);
      }

      return;
    });
  } else {
    req.channel = responsePayload.channel; // get slack channel history

    next();
  }
};

exports.initButtonConfirmation = initButtonConfirmation;