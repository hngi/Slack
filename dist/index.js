"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _debug = _interopRequireDefault(require("debug"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _path = _interopRequireDefault(require("path"));

var _index = _interopRequireDefault(require("./routes/index"));

/**
* @fileOverview - application entry point
* @requires - express
* @requires - body-parser
* @requires - dotenv
* @requires - cors
* @requires - ./routes
* @exports - app.js
* */
_dotenv["default"].config(); // declare constants


var app = (0, _express["default"])();
var port = process.env.PORT || 3000; // declare middleware

app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.use(_bodyParser["default"].json());
app.use(_express["default"]["static"](_path["default"].join(__dirname, '../public'))); // 3rd party middleware

app.use((0, _cors["default"])('*'));
(0, _index["default"])(app); // listen to app port

app.listen(port, (0, _debug["default"])('app/debug')("App listening on port ".concat(port)));
var _default = app;
exports["default"] = _default;