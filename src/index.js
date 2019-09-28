import express from 'express';
import cors from 'cors';
import debug from 'debug';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import routes from './routes/index';

/**
* @fileOverview - application entry point
* @requires - express
* @requires - body-parser
* @requires - dotenv
* @requires - cors
* @requires - ./routes
* @exports - app.js
* */

dotenv.config();

// declare constants
const app = express();
const port = process.env.PORT || 3000;

// declare middleware
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());
app.use((express.static(path.join(__dirname, '../public'))));

// 3rd party middleware
app.use(cors('*'));

routes(app);

app.use('/redirect', (express.static(path.join(__dirname, '../public/redirect.html'))));

// listen to app port
app.listen(port, debug('app/debug')(`App listening on port ${port}`));

export default app;
