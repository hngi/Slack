"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.googleConfig = exports.REDIRECT_URI = exports.CLIENT_SECRET = exports.CLIENT_ID = exports.BOT_TOKEN = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv["default"].config();
/**
 * This is a configuration file that determinces which database configuration should
 * be used base on the environment we are running the app
 * @requires - dotenv
 * @exports - Config
 */


var _process$env = process.env,
    BOT_TOKEN = _process$env.BOT_TOKEN,
    CLIENT_ID = _process$env.CLIENT_ID,
    CLIENT_SECRET = _process$env.CLIENT_SECRET,
    REDIRECT_URI = _process$env.REDIRECT_URI;
exports.REDIRECT_URI = REDIRECT_URI;
exports.CLIENT_SECRET = CLIENT_SECRET;
exports.CLIENT_ID = CLIENT_ID;
exports.BOT_TOKEN = BOT_TOKEN;
var googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // e.g. _ASDFA%DFASDFASDFASD#FAD-
  redirect: process.env.GOOGLE_REDIRECT_URL // this must match your google api settings

};
exports.googleConfig = googleConfig;